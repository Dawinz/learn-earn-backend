"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordEarning = recordEarning;
exports.getEarningsHistory = getEarningsHistory;
exports.getDailyEarnings = getDailyEarnings;
const Earning_1 = __importDefault(require("../models/Earning"));
const Settings_1 = __importDefault(require("../models/Settings"));
const Audit_1 = __importDefault(require("../models/Audit"));
const economics_1 = require("../utils/economics");
/**
 * Record an earning (coins earned from lesson, quiz, etc.)
 */
async function recordEarning(req, res) {
    try {
        const { deviceId } = req;
        const { source, lessonId, adSlotId } = req.body;
        if (!source) {
            return res.status(400).json({
                error: 'Earning source is required'
            });
        }
        // Get current settings
        const settings = await Settings_1.default.findOne();
        if (!settings) {
            return res.status(500).json({ error: 'Settings not configured' });
        }
        // Calculate coin reward
        const coins = (0, economics_1.calculateCoinRewards)(source, settings.eCPM_USD, settings.coinToUsdRate);
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
        const capCheck = (0, economics_1.checkDailyEarningCap)(totalEarningsToday, settings.maxDailyEarnUsd);
        if (capCheck.exceeded) {
            return res.status(400).json({
                error: 'Daily earning cap exceeded',
                code: 'DAILY_CAP_EXCEEDED',
                remaining: capCheck.remaining
            });
        }
        // Check if this would exceed the cap
        if (totalEarningsToday + usd > settings.maxDailyEarnUsd) {
            const allowedUsd = settings.maxDailyEarnUsd - totalEarningsToday;
            const allowedCoins = Math.floor(allowedUsd / settings.coinToUsdRate);
            return res.status(400).json({
                error: 'This earning would exceed daily cap',
                code: 'WOULD_EXCEED_CAP',
                allowedUsd,
                allowedCoins,
                requestedUsd: usd,
                requestedCoins: coins
            });
        }
        // Create earning record
        const earning = await Earning_1.default.create({
            deviceId,
            source: source,
            coins,
            usd,
            lessonId,
            adSlotId
        });
        // Log the earning
        await Audit_1.default.create({
            deviceId,
            action: 'earning_recorded',
            detail: `${source}: ${coins} coins ($${usd})`,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });
        res.json({
            success: true,
            earning: {
                id: earning._id,
                coins,
                usd,
                source,
                totalEarningsToday: totalEarningsToday + usd,
                remainingCap: settings.maxDailyEarnUsd - (totalEarningsToday + usd)
            }
        });
    }
    catch (error) {
        console.error('Record earning error:', error);
        res.status(500).json({ error: 'Failed to record earning' });
    }
}
/**
 * Get user's earnings history
 */
async function getEarningsHistory(req, res) {
    try {
        const { deviceId } = req;
        const { page = 1, limit = 20, source } = req.query;
        const query = { deviceId };
        if (source) {
            query.source = source;
        }
        const earnings = await Earning_1.default.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit));
        const total = await Earning_1.default.countDocuments(query);
        // Calculate totals
        const totals = await Earning_1.default.aggregate([
            { $match: { deviceId } },
            {
                $group: {
                    _id: null,
                    totalCoins: { $sum: '$coins' },
                    totalUsd: { $sum: '$usd' }
                }
            }
        ]);
        res.json({
            earnings,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            },
            totals: totals[0] || { totalCoins: 0, totalUsd: 0 }
        });
    }
    catch (error) {
        console.error('Get earnings error:', error);
        res.status(500).json({ error: 'Failed to get earnings' });
    }
}
/**
 * Get daily earnings summary
 */
async function getDailyEarnings(req, res) {
    try {
        const { deviceId } = req;
        const { date } = req.query;
        const targetDate = date ? new Date(date) : new Date();
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);
        const earnings = await Earning_1.default.find({
            deviceId,
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ createdAt: -1 });
        const summary = earnings.reduce((acc, earning) => {
            acc.totalCoins += earning.coins;
            acc.totalUsd += earning.usd;
            acc.bySource[earning.source] = (acc.bySource[earning.source] || 0) + earning.coins;
            return acc;
        }, {
            totalCoins: 0,
            totalUsd: 0,
            bySource: {}
        });
        res.json({
            date: targetDate.toISOString().split('T')[0],
            earnings,
            summary
        });
    }
    catch (error) {
        console.error('Get daily earnings error:', error);
        res.status(500).json({ error: 'Failed to get daily earnings' });
    }
}
//# sourceMappingURL=earningController.js.map