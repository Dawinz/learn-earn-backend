import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import Audit from '../models/Audit';
import { verifySignature } from '../utils/crypto';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
  deviceId?: string;
}

/**
 * Verify device signature and authenticate user
 */
export async function authenticateDevice(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { deviceId, signature, nonce, payload } = req.body;
    
    if (!deviceId || !signature || !nonce || !payload) {
      return res.status(400).json({
        error: 'Missing required authentication fields'
      });
    }
    
    // Find user by device ID
    const user = await User.findOne({ deviceId });
    if (!user) {
      return res.status(401).json({
        error: 'Device not registered'
      });
    }
    
    // Verify signature
    const message = JSON.stringify({ nonce, payload });
    const isValidSignature = verifySignature(message, signature, user.pubKey);
    
    if (!isValidSignature) {
      // Log failed authentication attempt
      await Audit.create({
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
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}

/**
 * Verify admin JWT token
 */
export function authenticateAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

/**
 * Check if device is emulator and if payouts are allowed
 */
export function checkEmulatorPayoutPolicy(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
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

