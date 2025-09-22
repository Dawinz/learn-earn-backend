import { Response } from 'express';
import User from '../models/User';
import Audit from '../models/Audit';
import { AuthenticatedRequest } from '../middleware/auth';
import { generateDeviceIdentity, hashMobileMoneyNumber } from '../utils/crypto';

/**
 * Register a new device
 */
export async function registerDevice(req: AuthenticatedRequest, res: Response) {
  try {
    const { publicKey, isEmulator = false } = req.body;
    
    if (!publicKey) {
      return res.status(400).json({
        error: 'Public key is required'
      });
    }
    
    // Generate device ID using app pepper
    const appPepper = process.env.APP_PEPPER!;
    const deviceId = require('crypto')
      .createHash('sha256')
      .update(appPepper + publicKey)
      .digest('hex');
    
    // Check if device already exists
    const existingUser = await User.findOne({ deviceId });
    if (existingUser) {
      return res.status(409).json({
        error: 'Device already registered',
        deviceId: existingUser.deviceId
      });
    }
    
    // Create new user
    const user = await User.create({
      deviceId,
      pubKey: publicKey,
      isEmulator
    });
    
    // Log registration
    await Audit.create({
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
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
}

/**
 * Set mobile money number (with 30-day lock)
 */
export async function setMobileMoneyNumber(req: AuthenticatedRequest, res: Response) {
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
    
    const user = await User.findOne({ deviceId });
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
    const mmHash = hashMobileMoneyNumber(mobileNumber, process.env.APP_PEPPER!);
    const lockUntil = new Date();
    lockUntil.setDate(lockUntil.getDate() + parseInt(process.env.NUMBER_CHANGE_LOCK_DAYS || '30'));
    
    // Update user
    user.mmHash = mmHash;
    user.numberLockedUntil = lockUntil;
    await user.save();
    
    // Log the action
    await Audit.create({
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
  } catch (error) {
    console.error('Set mobile number error:', error);
    res.status(500).json({ error: 'Failed to set mobile number' });
  }
}

/**
 * Get user profile
 */
export async function getUserProfile(req: AuthenticatedRequest, res: Response) {
  try {
    const { deviceId } = req;
    
    const user = await User.findOne({ deviceId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      deviceId: user.deviceId,
      isEmulator: user.isEmulator,
      hasMobileNumber: !!user.mmHash,
      numberLockedUntil: user.numberLockedUntil,
      createdAt: user.createdAt,
      lastActiveAt: user.lastActiveAt
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
}
