"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateDevice = authenticateDevice;
exports.authenticateToken = authenticateToken;
exports.authenticateAdmin = authenticateAdmin;
exports.checkEmulatorPayoutPolicy = checkEmulatorPayoutPolicy;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const AuthUser_1 = __importDefault(require("../models/AuthUser"));
const Audit_1 = __importDefault(require("../models/Audit"));
const crypto_1 = require("../utils/crypto");
/**
 * Verify device signature and authenticate user
 */
async function authenticateDevice(req, res, next) {
    try {
        const { deviceId, signature, nonce, payload } = req.body;
        if (!deviceId || !signature || !nonce || !payload) {
            return res.status(400).json({
                error: 'Missing required authentication fields'
            });
        }
        // Find user by device ID
        const user = await User_1.default.findOne({ deviceId });
        if (!user) {
            return res.status(401).json({
                error: 'Device not registered'
            });
        }
        // Verify signature
        const message = JSON.stringify({ nonce, payload });
        const isValidSignature = (0, crypto_1.verifySignature)(message, signature, user.pubKey);
        if (!isValidSignature) {
            // Log failed authentication attempt
            await Audit_1.default.create({
                deviceId,
                action: 'auth_failed',
                detail: 'Invalid signature',
                ipAddress: req.ip,
                userAgent: req.get('User-Agent')
            });
            return res.status(401).json({
                error: 'Invalid signature'
            });
        }
        // Update last active timestamp
        user.lastActiveAt = new Date();
        await user.save();
        req.user = user;
        req.deviceId = deviceId;
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
}
/**
 * Verify JWT token for authenticated users
 */
async function authenticateToken(req, res, next) {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }
        const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Verify user still exists
        const user = await AuthUser_1.default.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }
        req.userId = decoded.userId;
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
}
/**
 * Verify admin JWT token
 */
function authenticateAdmin(req, res, next) {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}
/**
 * Check if device is emulator and if payouts are allowed
 */
function checkEmulatorPayoutPolicy(req, res, next) {
    const { emulatorPayouts } = req.body;
    const isEmulator = emulatorPayouts === false; // Assuming false means emulator detected
    if (isEmulator && process.env.EMULATOR_PAYOUTS === 'false') {
        return res.status(403).json({
            error: 'Payouts disabled for emulator devices',
            code: 'EMULATOR_BLOCKED'
        });
    }
    next();
}
//# sourceMappingURL=auth.js.map