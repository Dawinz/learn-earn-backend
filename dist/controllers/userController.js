"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDevice = registerDevice;
exports.setMobileMoneyNumber = setMobileMoneyNumber;
exports.getUserProfile = getUserProfile;
exports.completeLesson = completeLesson;
exports.getUserProgress = getUserProgress;
exports.performDailyReset = performDailyReset;
const User_1 = __importDefault(require("../models/User"));
const Audit_1 = __importDefault(require("../models/Audit"));
const crypto_1 = require("../utils/crypto");
/**
 * Register a new device
 */
async function registerDevice(req, res) {
    try {
        const { publicKey, isEmulator = false } = req.body;
        if (!publicKey) {
            return res.status(400).json({
                error: 'Public key is required'
            });
        }
        // Generate device ID using app pepper
        const appPepper = process.env.APP_PEPPER;
        const deviceId = require('crypto')
            .createHash('sha256')
            .update(appPepper + publicKey)
            .digest('hex');
        // Check if device already exists
        const existingUser = await User_1.default.findOne({ deviceId });
        if (existingUser) {
            return res.status(409).json({
                error: 'Device already registered',
                deviceId: existingUser.deviceId
            });
        }
        // Create new user
        const user = await User_1.default.create({
            deviceId,
            pubKey: publicKey,
            isEmulator
        });
        // Log registration
        await Audit_1.default.create({
            deviceId,
            action: 'device_registered',
            detail: `Emulator: ${isEmulator}`,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });
        res.status(201).json({
            success: true,
            deviceId: user.deviceId,
            message: 'Device registered successfully'
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
}
/**
 * Set mobile money number (with 30-day lock)
 */
async function setMobileMoneyNumber(req, res) {
    try {
        const { mobileNumber } = req.body;
        const { deviceId } = req;
        if (!mobileNumber) {
            return res.status(400).json({
                error: 'Mobile number is required'
            });
        }
        // Validate mobile number format (basic validation)
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        if (!phoneRegex.test(mobileNumber)) {
            return res.status(400).json({
                error: 'Invalid mobile number format'
            });
        }
        const user = await User_1.default.findOne({ deviceId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Check if number is already locked
        if (user.mmHash && user.numberLockedUntil && user.numberLockedUntil > new Date()) {
            return res.status(400).json({
                error: 'Mobile number is locked and cannot be changed',
                lockedUntil: user.numberLockedUntil
            });
        }
        // Hash the mobile number
        const mmHash = (0, crypto_1.hashMobileMoneyNumber)(mobileNumber, process.env.APP_PEPPER);
        const lockUntil = new Date();
        lockUntil.setDate(lockUntil.getDate() + parseInt(process.env.NUMBER_CHANGE_LOCK_DAYS || '30'));
        // Update user
        user.mmHash = mmHash;
        user.numberLockedUntil = lockUntil;
        await user.save();
        // Log the action
        await Audit_1.default.create({
            deviceId,
            action: 'mobile_number_set',
            detail: `Locked until: ${lockUntil.toISOString()}`,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });
        res.json({
            success: true,
            message: 'Mobile number set and locked for 30 days',
            lockedUntil: lockUntil
        });
    }
    catch (error) {
        console.error('Set mobile number error:', error);
        res.status(500).json({ error: 'Failed to set mobile number' });
    }
}
/**
 * Get user profile
 */
async function getUserProfile(req, res) {
    try {
        const { deviceId } = req;
        const user = await User_1.default.findOne({ deviceId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            deviceId: user.deviceId,
            isEmulator: user.isEmulator,
            hasMobileNumber: !!user.mmHash,
            numberLockedUntil: user.numberLockedUntil,
            createdAt: user.createdAt,
            lastActiveAt: user.lastActiveAt,
            lastDailyReset: user.lastDailyReset,
            completedLessons: user.completedLessons,
            dailyResetCount: user.dailyResetCount
        });
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
}
/**
 * Complete a lesson
 */
async function completeLesson(req, res) {
    try {
        const { lessonId } = req.params;
        const { deviceId } = req;
        if (!lessonId) {
            return res.status(400).json({ error: 'Lesson ID is required' });
        }
        const user = await User_1.default.findOne({ deviceId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Add lesson to completed lessons if not already completed
        if (!user.completedLessons.includes(lessonId)) {
            user.completedLessons.push(lessonId);
            await user.save();
        }
        // Log the action
        await Audit_1.default.create({
            deviceId,
            action: 'lesson_completed',
            detail: `Lesson ID: ${lessonId}`,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });
        res.json({
            success: true,
            message: 'Lesson completed successfully',
            completedLessons: user.completedLessons
        });
    }
    catch (error) {
        console.error('Complete lesson error:', error);
        res.status(500).json({ error: 'Failed to complete lesson' });
    }
}
/**
 * Get user progress
 */
async function getUserProgress(req, res) {
    try {
        const { deviceId } = req;
        const user = await User_1.default.findOne({ deviceId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            completedLessons: user.completedLessons,
            lastDailyReset: user.lastDailyReset,
            dailyResetCount: user.dailyResetCount,
            isNewDay: isNewDay(user.lastDailyReset)
        });
    }
    catch (error) {
        console.error('Get progress error:', error);
        res.status(500).json({ error: 'Failed to get progress' });
    }
}
/**
 * Perform daily reset
 */
async function performDailyReset(req, res) {
    try {
        const { deviceId } = req;
        const user = await User_1.default.findOne({ deviceId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        // Check if reset is needed
        if (user.lastDailyReset && !isNewDay(user.lastDailyReset)) {
            return res.status(400).json({
                error: 'Daily reset already performed today',
                lastReset: user.lastDailyReset
            });
        }
        // Perform reset
        user.completedLessons = [];
        user.lastDailyReset = today;
        user.dailyResetCount += 1;
        await user.save();
        // Log the action
        await Audit_1.default.create({
            deviceId,
            action: 'daily_reset',
            detail: `Reset count: ${user.dailyResetCount}`,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });
        res.json({
            success: true,
            message: 'Daily reset completed successfully',
            resetDate: today,
            dailyResetCount: user.dailyResetCount,
            completedLessons: user.completedLessons
        });
    }
    catch (error) {
        console.error('Daily reset error:', error);
        res.status(500).json({ error: 'Failed to perform daily reset' });
    }
}
/**
 * Check if it's a new day since last reset
 */
function isNewDay(lastReset) {
    if (!lastReset)
        return true;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastResetDay = new Date(lastReset.getFullYear(), lastReset.getMonth(), lastReset.getDate());
    return lastResetDay < today;
}
//# sourceMappingURL=userController.js.map