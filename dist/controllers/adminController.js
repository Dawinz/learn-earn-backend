"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLogin = adminLogin;
exports.getDashboard = getDashboard;
exports.getPayoutQueue = getPayoutQueue;
exports.updatePayoutStatus = updatePayoutStatus;
exports.getLessonsAdmin = getLessonsAdmin;
exports.saveLesson = saveLesson;
exports.getSettings = getSettings;
exports.updateSettings = updateSettings;
exports.getAuditLogs = getAuditLogs;
exports.getUsers = getUsers;
exports.blockUser = blockUser;
exports.unblockUser = unblockUser;
exports.getAnalytics = getAnalytics;
const User_1 = __importDefault(require("../models/User"));
const Payout_1 = __importDefault(require("../models/Payout"));
const Settings_1 = __importDefault(require("../models/Settings"));
const Lesson_1 = __importDefault(require("../models/Lesson"));
const Earning_1 = __importDefault(require("../models/Earning"));
const Audit_1 = __importDefault(require("../models/Audit"));
const economics_1 = require("../utils/economics");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Admin login - simple development login
 */
async function adminLogin(req, res) {
    try {
        const { username, password } = req.body;
        // Simple hardcoded admin credentials for development
        if (username === 'admin' && password === 'admin123') {
            const token = jsonwebtoken_1.default.sign({ id: 'admin', username: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
            return res.json({
                success: true,
                token,
                user: { id: 'admin', username: 'admin' }
            });
        }
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
}
/**
 * Get admin dashboard overview
 */
async function getDashboard(req, res) {
    try {
        const settings = await Settings_1.default.findOne();
        if (!settings) {
            return res.status(500).json({ error: 'Settings not configured' });
        }
        const budget = (0, economics_1.calculateDailyBudget)(settings);
        // Get today's payouts
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const payoutsToday = await Payout_1.default.aggregate([
            {
                $match: {
                    requestedAt: { $gte: today, $lt: tomorrow }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalUsd: { $sum: '$amountUsd' }
                }
            }
        ]);
        // Get pending payouts
        const pendingPayouts = await Payout_1.default.find({ status: 'pending' })
            .sort({ requestedAt: 1 })
            .limit(10);
        // Get recent earnings
        const recentEarnings = await Earning_1.default.aggregate([
            {
                $match: {
                    createdAt: { $gte: today, $lt: tomorrow }
                }
            },
            {
                $group: {
                    _id: '$source',
                    count: { $sum: 1 },
                    totalCoins: { $sum: '$coins' },
                    totalUsd: { $sum: '$usd' }
                }
            }
        ]);
        res.json({
            budget: {
                ...budget,
                remainingBudget: budget.payoutBudgetToday - (payoutsToday.find(p => p._id === 'paid')?.totalUsd || 0)
            },
            payoutsToday,
            pendingPayouts,
            recentEarnings,
            settings: {
                eCPM_USD: settings.eCPM_USD,
                safetyMargin: settings.safetyMargin,
                minPayoutUsd: settings.minPayoutUsd,
                maxDailyEarnUsd: settings.maxDailyEarnUsd
            }
        });
    }
    catch (error) {
        console.error('Get dashboard error:', error);
        res.status(500).json({ error: 'Failed to get dashboard data' });
    }
}
/**
 * Get payout queue
 */
async function getPayoutQueue(req, res) {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const query = {};
        if (status) {
            query.status = status;
        }
        const payouts = await Payout_1.default.find(query)
            .sort({ requestedAt: -1 })
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit));
        const total = await Payout_1.default.countDocuments(query);
        res.json({
            payouts,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Get payout queue error:', error);
        res.status(500).json({ error: 'Failed to get payout queue' });
    }
}
/**
 * Update payout status
 */
async function updatePayoutStatus(req, res) {
    try {
        const { payoutId } = req.params;
        const { status, txRef, adminNotes, reason } = req.body;
        if (!['pending', 'paid', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        const payout = await Payout_1.default.findById(payoutId);
        if (!payout) {
            return res.status(404).json({ error: 'Payout not found' });
        }
        const updateData = { status };
        if (txRef)
            updateData.txRef = txRef;
        if (adminNotes)
            updateData.adminNotes = adminNotes;
        if (reason)
            updateData.reason = reason;
        if (status === 'paid') {
            updateData.paidAt = new Date();
        }
        const updatedPayout = await Payout_1.default.findByIdAndUpdate(payoutId, updateData, { new: true });
        // Log the action
        await Audit_1.default.create({
            deviceId: payout.deviceId,
            action: 'payout_status_updated',
            detail: `Status: ${status}, Admin: ${req.user?.email || 'unknown'}`,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });
        res.json({
            success: true,
            payout: updatedPayout
        });
    }
    catch (error) {
        console.error('Update payout status error:', error);
        res.status(500).json({ error: 'Failed to update payout status' });
    }
}
/**
 * Get lessons for admin
 */
async function getLessonsAdmin(req, res) {
    try {
        const { page = 1, limit = 20, published } = req.query;
        const query = {};
        if (published !== undefined) {
            query.isPublished = published === 'true';
        }
        const lessons = await Lesson_1.default.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit));
        const total = await Lesson_1.default.countDocuments(query);
        res.json({
            lessons,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Get lessons admin error:', error);
        res.status(500).json({ error: 'Failed to get lessons' });
    }
}
/**
 * Create or update lesson
 */
async function saveLesson(req, res) {
    try {
        const { lessonId, ...lessonData } = req.body;
        if (lessonId) {
            // Update existing lesson
            const lesson = await Lesson_1.default.findByIdAndUpdate(lessonId, { ...lessonData, updatedAt: new Date() }, { new: true });
            if (!lesson) {
                return res.status(404).json({ error: 'Lesson not found' });
            }
            res.json({ success: true, lesson });
        }
        else {
            // Create new lesson
            const lesson = await Lesson_1.default.create(lessonData);
            res.status(201).json({ success: true, lesson });
        }
    }
    catch (error) {
        console.error('Save lesson error:', error);
        res.status(500).json({ error: 'Failed to save lesson' });
    }
}
/**
 * Get settings
 */
async function getSettings(req, res) {
    try {
        const settings = await Settings_1.default.findOne();
        if (!settings) {
            return res.status(404).json({ error: 'Settings not found' });
        }
        res.json({ settings });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get settings' });
    }
}
/**
 * Update settings
 */
async function updateSettings(req, res) {
    try {
        const settingsData = req.body;
        const settings = await Settings_1.default.findOneAndUpdate({}, { ...settingsData, lastUpdated: new Date() }, { upsert: true, new: true });
        res.json({ success: true, settings });
    }
    catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
}
/**
 * Get audit logs
 */
async function getAuditLogs(req, res) {
    try {
        const { deviceId, action, page = 1, limit = 50 } = req.query;
        const query = {};
        if (deviceId)
            query.deviceId = deviceId;
        if (action)
            query.action = action;
        const audits = await Audit_1.default.find(query)
            .sort({ timestamp: -1 })
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit));
        const total = await Audit_1.default.countDocuments(query);
        res.json({
            audits,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Get audit logs error:', error);
        res.status(500).json({ error: 'Failed to get audit logs' });
    }
}
/**
 * Get users for admin management
 */
async function getUsers(req, res) {
    try {
        const { page = 1, limit = 20, filter, status, sortKey = 'createdAt', sortOrder = 'desc' } = req.query;
        // Build query
        const query = {};
        if (filter) {
            query.deviceId = { $regex: filter, $options: 'i' };
        }
        if (status && status !== 'all') {
            query.status = status;
        }
        // Build sort object
        const sort = {};
        sort[sortKey] = sortOrder === 'asc' ? 1 : -1;
        // Get users with aggregation to include earnings and payouts
        const users = await User_1.default.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'earnings',
                    localField: 'deviceId',
                    foreignField: 'deviceId',
                    as: 'earnings'
                }
            },
            {
                $lookup: {
                    from: 'payouts',
                    localField: 'deviceId',
                    foreignField: 'deviceId',
                    as: 'payouts'
                }
            },
            {
                $addFields: {
                    totalEarningsUsd: { $sum: '$earnings.usd' },
                    totalPayoutsUsd: { $sum: '$payouts.amount' },
                    lastActivity: { $max: ['$lastActivity', { $max: '$earnings.createdAt' }] }
                }
            },
            { $sort: sort },
            { $skip: (Number(page) - 1) * Number(limit) },
            { $limit: Number(limit) },
            {
                $project: {
                    _id: 1,
                    deviceId: 1,
                    status: 1,
                    totalEarningsUsd: 1,
                    totalPayoutsUsd: 1,
                    lastActivity: 1,
                    createdAt: 1
                }
            }
        ]);
        const total = await User_1.default.countDocuments(query);
        res.json({
            users,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to get users' });
    }
}
/**
 * Block a user
 */
async function blockUser(req, res) {
    try {
        const { userId } = req.params;
        const user = await User_1.default.findByIdAndUpdate(userId, { status: 'blocked', updatedAt: new Date() }, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Log the action
        await Audit_1.default.create({
            deviceId: user.deviceId,
            action: 'user_blocked',
            details: { blockedBy: 'admin', reason: 'Manual block' }
        });
        res.json({ message: 'User blocked successfully', user });
    }
    catch (error) {
        console.error('Block user error:', error);
        res.status(500).json({ error: 'Failed to block user' });
    }
}
/**
 * Unblock a user
 */
async function unblockUser(req, res) {
    try {
        const { userId } = req.params;
        const user = await User_1.default.findByIdAndUpdate(userId, { status: 'active', updatedAt: new Date() }, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Log the action
        await Audit_1.default.create({
            deviceId: user.deviceId,
            action: 'user_unblocked',
            details: { unblockedBy: 'admin', reason: 'Manual unblock' }
        });
        res.json({ message: 'User unblocked successfully', user });
    }
    catch (error) {
        console.error('Unblock user error:', error);
        res.status(500).json({ error: 'Failed to unblock user' });
    }
}
/**
 * Get analytics data
 */
async function getAnalytics(req, res) {
    try {
        const totalUsers = await User_1.default.countDocuments();
        const activeUsers = await User_1.default.countDocuments({ status: 'active' });
        const blockedUsers = await User_1.default.countDocuments({ status: 'blocked' });
        const totalEarnings = await Earning_1.default.aggregate([
            { $group: { _id: null, total: { $sum: '$amountUsd' } } }
        ]);
        const totalPayouts = await Payout_1.default.aggregate([
            { $group: { _id: null, total: { $sum: '$amountUsd' } } }
        ]);
        const recentEarnings = await Earning_1.default.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('userId', 'deviceId')
            .select('amountUsd source createdAt');
        const recentPayouts = await Payout_1.default.find()
            .sort({ requestedAt: -1 })
            .limit(10)
            .select('amountUsd status requestedAt paidAt');
        res.json({
            totalUsers,
            activeUsers,
            blockedUsers,
            totalEarningsUsd: totalEarnings[0]?.total || 0,
            totalPayoutsUsd: totalPayouts[0]?.total || 0,
            recentEarnings,
            recentPayouts
        });
    }
    catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: 'Failed to get analytics' });
    }
}
//# sourceMappingURL=adminController.js.map