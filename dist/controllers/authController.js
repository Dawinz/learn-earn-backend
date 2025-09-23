"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = exports.changePassword = exports.updateProfile = exports.getProfile = exports.logout = exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AuthUser_1 = __importDefault(require("../models/AuthUser"));
const Audit_1 = __importDefault(require("../models/Audit"));
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
/**
 * Sign up a new user
 */
const signup = async (req, res) => {
    try {
        const { email, password, name, phoneNumber } = req.body;
        // Basic validation
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: 'Email, password, and name are required'
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }
        // Check if user already exists
        const existingUser = await AuthUser_1.default.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User already exists with this email'
            });
        }
        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcryptjs_1.default.hash(password, saltRounds);
        // Create user
        const user = await AuthUser_1.default.create({
            email,
            password: hashedPassword,
            name,
            phoneNumber,
            isEmailVerified: false
        });
        // Generate JWT token
        const payload = { userId: user._id.toString(), email: user.email };
        const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        // Log registration
        await Audit_1.default.create({
            deviceId: user._id.toString(),
            action: 'user_registered',
            detail: `Email: ${email}`,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            token,
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                phoneNumber: user.phoneNumber,
                isEmailVerified: user.isEmailVerified,
                createdAt: user.createdAt
            }
        });
    }
    catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.signup = signup;
/**
 * Login user
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Basic validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }
        // Find user
        const user = await AuthUser_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        // Check password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        // Update last login
        user.lastLoginAt = new Date();
        await user.save();
        // Generate JWT token
        const payload = { userId: user._id.toString(), email: user.email };
        const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        // Log login
        await Audit_1.default.create({
            deviceId: user._id.toString(),
            action: 'user_login',
            detail: `Email: ${email}`,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                phoneNumber: user.phoneNumber,
                isEmailVerified: user.isEmailVerified,
                createdAt: user.createdAt,
                lastLoginAt: user.lastLoginAt
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.login = login;
/**
 * Logout user
 */
const logout = async (req, res) => {
    try {
        // In a more sophisticated setup, you might want to blacklist the token
        // For now, we'll just return success since JWT is stateless
        res.json({
            success: true,
            message: 'Logout successful'
        });
    }
    catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.logout = logout;
/**
 * Get user profile
 */
const getProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await AuthUser_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.json({
            success: true,
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                phoneNumber: user.phoneNumber,
                isEmailVerified: user.isEmailVerified,
                createdAt: user.createdAt,
                lastLoginAt: user.lastLoginAt
            }
        });
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getProfile = getProfile;
/**
 * Update user profile
 */
const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, phoneNumber } = req.body;
        const user = await AuthUser_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // Update fields
        if (name)
            user.name = name;
        if (phoneNumber)
            user.phoneNumber = phoneNumber;
        await user.save();
        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                phoneNumber: user.phoneNumber,
                isEmailVerified: user.isEmailVerified,
                createdAt: user.createdAt,
                lastLoginAt: user.lastLoginAt
            }
        });
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.updateProfile = updateProfile;
/**
 * Change password
 */
const changePassword = async (req, res) => {
    try {
        const userId = req.userId;
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters'
            });
        }
        const user = await AuthUser_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // Verify current password
        const isCurrentPasswordValid = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }
        // Hash new password
        const saltRounds = 12;
        const hashedNewPassword = await bcryptjs_1.default.hash(newPassword, saltRounds);
        user.password = hashedNewPassword;
        await user.save();
        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    }
    catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.changePassword = changePassword;
/**
 * Forgot password
 */
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }
        const user = await AuthUser_1.default.findOne({ email });
        if (!user) {
            // Don't reveal if user exists or not
            return res.json({
                success: true,
                message: 'If an account with that email exists, a password reset link has been sent'
            });
        }
        // In a real implementation, you would:
        // 1. Generate a password reset token
        // 2. Send an email with the reset link
        // 3. Store the token with expiration
        // For now, just return success
        res.json({
            success: true,
            message: 'If an account with that email exists, a password reset link has been sent'
        });
    }
    catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.forgotPassword = forgotPassword;
//# sourceMappingURL=authController.js.map