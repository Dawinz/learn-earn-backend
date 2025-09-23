"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdMobConfig = getAdMobConfig;
exports.recordAdImpression = recordAdImpression;
exports.processAdReward = processAdReward;
exports.getAdStatistics = getAdStatistics;
const AdMobConfig_1 = __importDefault(require("../models/AdMobConfig"));
const Earning_1 = __importDefault(require("../models/Earning"));
const Settings_1 = __importDefault(require("../models/Settings"));
const Audit_1 = __importDefault(require("../models/Audit"));
const economics_1 = require("../utils/economics");
const cooldownController_1 = require("./cooldownController");
const dailyEarningController_1 = require("./dailyEarningController");
/**
 * Get AdMob configuration for mobile app
 */
async function getAdMobConfig(req, res) {
    try {
        const { platform } = req.params;
        if (!platform || !['android', 'ios'].includes(platform)) {
            return res.status(400).json({
                error: 'Valid platform (android/ios) is required'
            });
        }
        const config = await AdMobConfig_1.default.findOne({
            platform: platform,
            isActive: true
        });
        if (!config) {
            return res.status(404).json({
                error: 'AdMob configuration not found for this platform'
            });
        }
        res.json({
            platform: config.platform,
            appId: config.appId,
            adUnits: config.adUnits,
            rewards: config.rewards
        });
    }
    catch (error) {
        console.error('Get AdMob config error:', error);
        res.status(500).json({ error: 'Failed to get AdMob configuration' });
    }
}
/**
 * Record ad impression (for analytics)
 */
async function recordAdImpression(req, res) {
    try {
        const { deviceId } = req;
        const { adUnitId, adType, platform } = req.body;
        if (!adUnitId || !adType || !platform) {
            return res.status(400).json({
                error: 'Ad unit ID, ad type, and platform are required'
            });
        }
        // Log the ad impression
        await Audit_1.default.create({
            deviceId,
            action: 'ad_impression',
            detail: `${adType} ad impression on ${platform}: ${adUnitId}`,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });
        res.json({
            success: true,
            message: 'Ad impression recorded'
        });
    }
    catch (error) {
        console.error('Record ad impression error:', error);
        res.status(500).json({ error: 'Failed to record ad impression' });
    }
}
/**
 * Process ad reward (when user completes rewarded video)
 */
async function processAdReward(req, res) {
    try {
        const { deviceId } = req;
        const { adUnitId, platform, signature, nonce } = req.body;
        if (!adUnitId || !platform || !signature || !nonce) {
            return res.status(400).json({
                error: 'Ad unit ID, platform, signature, and nonce are required'
            });
        }
        // Check if user is in cooldown for ad reward actions
        if (!deviceId) {
            return res.status(400).json({
                error: 'Device ID is required'
            });
        }
        const canWatchAd = await (0, cooldownController_1.canPerformEarningAction)(deviceId, 'ad-reward');
        if (!canWatchAd) {
            return res.status(429).json({
                error: 'You are in cooldown period. Please wait before watching another ad.',
                code: 'AD_COOLDOWN_ACTIVE'
            });
        }
        // Check daily earning status
        const dailyEarningStatus = await (0, dailyEarningController_1.canEarnToday)(deviceId);
        if (!dailyEarningStatus.canEarn) {
            return res.status(429).json({
                error: dailyEarningStatus.reason || 'Daily earning limit reached',
                code: 'DAILY_EARNING_LIMIT',
                pauseRemaining: dailyEarningStatus.pauseRemaining
            });
        }
        // Get AdMob config for the platform
        const config = await AdMobConfig_1.default.findOne({
            platform: platform,
            isActive: true
        });
        if (!config) {
            return res.status(404).json({
                error: 'AdMob configuration not found for this platform'
            });
        }
        // Verify this is a valid rewarded video ad unit
        if (adUnitId !== config.adUnits.rewardedVideo) {
            return res.status(400).json({
                error: 'Invalid ad unit ID for rewarded video'
            });
        }
        // Get current settings
        const settings = await Settings_1.default.findOne();
        if (!settings) {
            return res.status(500).json({ error: 'Settings not configured' });
        }
        // Verify signature (basic validation)
        const user = req.user;
        const message = JSON.stringify({ nonce, adUnitId, deviceId });
        // Note: In production, implement proper signature verification
        // Calculate reward
        const coins = config.rewards.rewardedVideo;
        const usd = (0, economics_1.coinsToUsd)(coins, settings.coinToUsdRate);
        // Check daily earning cap
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const earningsToday = await Earning_1.default.aggregate([
            {
                $match: {
                    deviceId,
                    createdAt: { $gte: today, $lt: tomorrow }
                }
            },
            {
                $group: {
                    _id: null,
                    totalUsd: { $sum: '$usd' }
                }
            }
        ]);
        const totalEarningsToday = earningsToday[0]?.totalUsd || 0;
        if (totalEarningsToday + usd > settings.maxDailyEarnUsd) {
            return res.status(400).json({
                error: 'Daily earning cap would be exceeded',
                code: 'DAILY_CAP_EXCEEDED',
                remaining: settings.maxDailyEarnUsd - totalEarningsToday
            });
        }
        // Create earning record
        const earning = await Earning_1.default.create({
            deviceId,
            source: 'ad-reward',
            coins,
            usd,
            adSlotId: adUnitId
        });
        // Apply cooldown and daily earning pause after successful ad reward
        if (deviceId) {
            await (0, cooldownController_1.applyEarningCooldown)(deviceId, 'ad-reward', settings);
            // Apply daily earning pause based on current earnings
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const todayEarnings = await Earning_1.default.aggregate([
                {
                    $match: {
                        deviceId,
                        createdAt: { $gte: today, $lt: tomorrow }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalUsd: { $sum: '$usd' }
                    }
                }
            ]);
            const earnedToday = todayEarnings[0]?.totalUsd || 0;
            await (0, dailyEarningController_1.applyDailyEarningPause)(deviceId, earnedToday, settings.maxDailyEarnUsd);
        }
        // Log the ad reward
        await Audit_1.default.create({
            deviceId,
            action: 'ad_reward_processed',
            detail: `Rewarded video completed: ${coins} coins ($${usd})`,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });
        res.json({
            success: true,
            reward: {
                coins,
                usd,
                adType: 'rewarded-video',
                totalEarningsToday: totalEarningsToday + usd,
                remainingCap: settings.maxDailyEarnUsd - (totalEarningsToday + usd)
            }
        });
    }
    catch (error) {
        console.error('Process ad reward error:', error);
        res.status(500).json({ error: 'Failed to process ad reward' });
    }
}
/**
 * Get ad statistics for admin
 */
async function getAdStatistics(req, res) {
    try {
        const { platform, startDate, endDate } = req.query;
        const matchQuery = {
            action: { $in: ['ad_impression', 'ad_reward_processed'] }
        };
        if (platform) {
            matchQuery.detail = { $regex: platform, $options: 'i' };
        }
        if (startDate && endDate) {
            matchQuery.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        const stats = await Audit_1.default.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: '$action',
                    count: { $sum: 1 },
                    platforms: { $addToSet: { $arrayElemAt: [{ $split: ['$detail', ' '] }, 4] } }
                }
            }
        ]);
        // Get ad earnings
        const adEarnings = await Earning_1.default.aggregate([
            {
                $match: {
                    source: 'ad-reward',
                    ...(startDate && endDate ? {
                        createdAt: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        }
                    } : {})
                }
            },
            {
                $group: {
                    _id: null,
                    totalCoins: { $sum: '$coins' },
                    totalUsd: { $sum: '$usd' },
                    count: { $sum: 1 }
                }
            }
        ]);
        res.json({
            statistics: stats,
            earnings: adEarnings[0] || { totalCoins: 0, totalUsd: 0, count: 0 }
        });
    }
    catch (error) {
        console.error('Get ad statistics error:', error);
        res.status(500).json({ error: 'Failed to get ad statistics' });
    }
}
//# sourceMappingURL=adMobController.js.map