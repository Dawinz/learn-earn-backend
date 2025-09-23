"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDailyEarningStatus = getDailyEarningStatus;
exports.applyDailyEarningPause = applyDailyEarningPause;
exports.canEarnToday = canEarnToday;
exports.calculateEarningTier = calculateEarningTier;
exports.calculatePauseDuration = calculatePauseDuration;
exports.getDailyEarningStats = getDailyEarningStats;
const Earning_1 = __importDefault(require("../models/Earning"));
const Settings_1 = __importDefault(require("../models/Settings"));
const CooldownPeriod_1 = __importDefault(require("../models/CooldownPeriod"));
/**
 * Check daily earning status and get remaining capacity
 */
async function getDailyEarningStatus(req, res) {
    try {
        const { deviceId } = req;
        if (!deviceId) {
            return res.status(400).json({
                error: 'Device ID is required'
            });
        }
        const settings = await Settings_1.default.findOne();
        if (!settings) {
            return res.status(500).json({ error: 'Settings not configured' });
        }
        // Get today's earnings
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
                    totalUsd: { $sum: '$usd' },
                    totalCoins: { $sum: '$coins' },
                    count: { $sum: 1 }
                }
            }
        ]);
        const earnings = todayEarnings[0] || { totalUsd: 0, totalCoins: 0, count: 0 };
        const remainingUsd = Math.max(0, settings.maxDailyEarnUsd - earnings.totalUsd);
        const remainingCoins = Math.round(remainingUsd / settings.coinToUsdRate);
        // Calculate earning tier and pause duration
        const earningTier = calculateEarningTier(earnings.totalUsd, settings.maxDailyEarnUsd);
        const pauseDuration = calculatePauseDuration(earningTier);
        // Check if user is currently in a pause
        const activePause = await CooldownPeriod_1.default.findOne({
            deviceId,
            action: 'daily-earning-pause',
            isActive: true
        });
        let pauseRemaining = 0;
        if (activePause) {
            const now = new Date();
            const pauseEnd = new Date(activePause.endsAt);
            if (now < pauseEnd) {
                pauseRemaining = Math.ceil((pauseEnd.getTime() - now.getTime()) / (1000 * 60));
            }
        }
        res.json({
            dailyStatus: {
                earnedToday: {
                    usd: earnings.totalUsd,
                    coins: earnings.totalCoins,
                    count: earnings.count
                },
                remaining: {
                    usd: remainingUsd,
                    coins: remainingCoins
                },
                tier: earningTier,
                pauseDuration,
                isPaused: pauseRemaining > 0,
                pauseRemainingMinutes: pauseRemaining,
                maxDailyUsd: settings.maxDailyEarnUsd
            }
        });
    }
    catch (error) {
        console.error('Get daily earning status error:', error);
        res.status(500).json({ error: 'Failed to get daily earning status' });
    }
}
/**
 * Apply smart daily earning pause based on current earnings
 */
async function applyDailyEarningPause(deviceId, earnedUsd, maxDailyUsd) {
    try {
        const earningTier = calculateEarningTier(earnedUsd, maxDailyUsd);
        const pauseDuration = calculatePauseDuration(earningTier);
        if (pauseDuration === 0) {
            return; // No pause needed
        }
        // Deactivate any existing daily earning pause
        await CooldownPeriod_1.default.updateMany({ deviceId, action: 'daily-earning-pause', isActive: true }, { isActive: false });
        // Create new pause
        const endsAt = new Date();
        endsAt.setMinutes(endsAt.getMinutes() + pauseDuration);
        await CooldownPeriod_1.default.create({
            deviceId,
            action: 'daily-earning-pause',
            durationMinutes: pauseDuration,
            endsAt,
            reason: `Daily earning pause - Tier ${earningTier}`,
            isActive: true
        });
        console.log(`Applied ${pauseDuration} minute daily earning pause for device ${deviceId} (Tier ${earningTier})`);
    }
    catch (error) {
        console.error('Apply daily earning pause error:', error);
    }
}
/**
 * Check if user can earn (not in pause and under limits)
 */
async function canEarnToday(deviceId) {
    try {
        const settings = await Settings_1.default.findOne();
        if (!settings) {
            return { canEarn: false, reason: 'Settings not configured' };
        }
        // Check daily earning pause
        const activePause = await CooldownPeriod_1.default.findOne({
            deviceId,
            action: 'daily-earning-pause',
            isActive: true
        });
        if (activePause) {
            const now = new Date();
            const pauseEnd = new Date(activePause.endsAt);
            if (now < pauseEnd) {
                const pauseRemaining = Math.ceil((pauseEnd.getTime() - now.getTime()) / (1000 * 60));
                return {
                    canEarn: false,
                    reason: 'Daily earning pause active',
                    pauseRemaining
                };
            }
            else {
                // Pause expired, deactivate it
                await CooldownPeriod_1.default.findByIdAndUpdate(activePause._id, { isActive: false });
            }
        }
        // Check daily earning cap
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
        if (earnedToday >= settings.maxDailyEarnUsd) {
            return { canEarn: false, reason: 'Daily earning cap reached' };
        }
        return { canEarn: true };
    }
    catch (error) {
        console.error('Can earn today error:', error);
        return { canEarn: false, reason: 'Error checking earning status' };
    }
}
/**
 * Calculate earning tier based on percentage of daily cap reached
 */
function calculateEarningTier(earnedUsd, maxDailyUsd) {
    const percentage = (earnedUsd / maxDailyUsd) * 100;
    if (percentage < 25)
        return 1; // 0-25%: No pause
    if (percentage < 50)
        return 2; // 25-50%: 5 minute pause
    if (percentage < 75)
        return 3; // 50-75%: 15 minute pause
    if (percentage < 90)
        return 4; // 75-90%: 30 minute pause
    if (percentage < 100)
        return 5; // 90-99%: 60 minute pause
    return 6; // 100%: 2 hour pause
}
/**
 * Calculate pause duration based on earning tier
 */
function calculatePauseDuration(tier) {
    switch (tier) {
        case 1: return 0; // No pause
        case 2: return 5; // 5 minutes
        case 3: return 15; // 15 minutes
        case 4: return 30; // 30 minutes
        case 5: return 60; // 1 hour
        case 6: return 120; // 2 hours
        default: return 0;
    }
}
/**
 * Get daily earning statistics for admin
 */
async function getDailyEarningStats(req, res) {
    try {
        const { startDate, endDate } = req.query;
        const matchQuery = {};
        if (startDate && endDate) {
            matchQuery.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        // Get daily earning statistics
        const stats = await Earning_1.default.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' }
                    },
                    totalUsd: { $sum: '$usd' },
                    totalCoins: { $sum: '$coins' },
                    uniqueUsers: { $addToSet: '$deviceId' },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    date: {
                        $dateFromParts: {
                            year: '$_id.year',
                            month: '$_id.month',
                            day: '$_id.day'
                        }
                    },
                    totalUsd: 1,
                    totalCoins: 1,
                    uniqueUsers: { $size: '$uniqueUsers' },
                    count: 1
                }
            },
            { $sort: { date: -1 } }
        ]);
        // Get pause statistics
        const pauseStats = await CooldownPeriod_1.default.aggregate([
            {
                $match: {
                    action: 'daily-earning-pause',
                    ...matchQuery
                }
            },
            {
                $group: {
                    _id: null,
                    totalPauses: { $sum: 1 },
                    averageDuration: { $avg: '$durationMinutes' },
                    totalDuration: { $sum: '$durationMinutes' }
                }
            }
        ]);
        res.json({
            dailyStats: stats,
            pauseStats: pauseStats[0] || { totalPauses: 0, averageDuration: 0, totalDuration: 0 }
        });
    }
    catch (error) {
        console.error('Get daily earning stats error:', error);
        res.status(500).json({ error: 'Failed to get daily earning statistics' });
    }
}
//# sourceMappingURL=dailyEarningController.js.map