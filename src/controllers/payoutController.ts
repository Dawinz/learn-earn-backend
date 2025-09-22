import { Response } from 'express';
import Payout from '../models/Payout';
import Earning from '../models/Earning';
import Settings from '../models/Settings';
import Cooldown from '../models/Cooldown';
import Audit from '../models/Audit';
import { AuthenticatedRequest } from '../middleware/auth';
import { verifySignature, generateNonce } from '../utils/crypto';
import { validatePayoutAmount, coinsToUsd } from '../utils/economics';

/**
 * Request a payout
 */
export async function requestPayout(req: AuthenticatedRequest, res: Response) {
  try {
    const { deviceId } = req;
    const { amountUsd, signature, nonce } = req.body;
    
    if (!amountUsd || !signature || !nonce) {
      return res.status(400).json({
        error: 'Amount, signature, and nonce are required'
      });
    }
    
    // Get current settings
    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(500).json({ error: 'Settings not configured' });
    }
    
    // Validate payout amount
    const amountValidation = validatePayoutAmount(amountUsd, settings.minPayoutUsd);
    if (!amountValidation.valid) {
      return res.status(400).json({
        error: amountValidation.reason,
        code: 'INVALID_AMOUNT'
      });
    }
    
    // Check if user has mobile number set
    const user = req.user!;
    if (!user.mmHash) {
      return res.status(400).json({
        error: 'Mobile money number not set',
        code: 'NO_MOBILE_NUMBER'
      });
    }
    
    // Check cooldown
    const cooldown = await Cooldown.findOne({ deviceId });
    if (cooldown && cooldown.nextPayoutAt > new Date()) {
      return res.status(400).json({
        error: 'Payout cooldown active',
        code: 'COOLDOWN_ACTIVE',
        nextPayoutAt: cooldown.nextPayoutAt
      });
    }
    
    // Check if emulator payouts are disabled
    if (user.isEmulator && !settings.emulatorPayouts) {
      return res.status(403).json({
        error: 'Payouts disabled for emulator devices',
        code: 'EMULATOR_BLOCKED'
      });
    }
    
    // Verify signature
    const message = JSON.stringify({ nonce, amountUsd, deviceId });
    const isValidSignature = verifySignature(message, signature, user.pubKey);
    if (!isValidSignature) {
      return res.status(401).json({
        error: 'Invalid signature',
        code: 'INVALID_SIGNATURE'
      });
    }
    
    // Check daily budget
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const payoutsToday = await Payout.aggregate([
      {
        $match: {
          createdAt: { $gte: today, $lt: tomorrow },
          status: { $in: ['pending', 'paid'] }
        }
      },
      {
        $group: {
          _id: null,
          totalUsd: { $sum: '$amountUsd' }
        }
      }
    ]);
    
    const totalPayoutsToday = payoutsToday[0]?.totalUsd || 0;
    const revenueToday = (settings.eCPM_USD * settings.impressionsToday) / 1000;
    const payoutBudgetToday = revenueToday * settings.safetyMargin;
    const remainingBudget = payoutBudgetToday - totalPayoutsToday;
    
    if (amountUsd > remainingBudget) {
      return res.status(400).json({
        error: 'Insufficient payout budget',
        code: 'BUDGET_EXCEEDED',
        remainingBudget,
        requestedAmount: amountUsd
      });
    }
    
    // Create payout request
    const payout = await Payout.create({
      deviceId,
      amountUsd,
      signature,
      nonce,
      status: 'pending'
    });
    
    // Set cooldown
    const cooldownHours = settings.payoutCooldownHours;
    const nextPayoutAt = new Date();
    nextPayoutAt.setHours(nextPayoutAt.getHours() + cooldownHours);
    
    await Cooldown.findOneAndUpdate(
      { deviceId },
      { 
        nextPayoutAt,
        reason: 'cooldown'
      },
      { upsert: true }
    );
    
    // Log the payout request
    await Audit.create({
      deviceId,
      action: 'payout_requested',
      detail: `Amount: $${amountUsd}, Payout ID: ${payout._id}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    res.json({
      success: true,
      payout: {
        id: payout._id,
        amountUsd,
        status: payout.status,
        requestedAt: payout.requestedAt,
        nextPayoutAt
      }
    });
  } catch (error) {
    console.error('Request payout error:', error);
    res.status(500).json({ error: 'Failed to request payout' });
  }
}

/**
 * Get payout history
 */
export async function getPayoutHistory(req: AuthenticatedRequest, res: Response) {
  try {
    const { deviceId } = req;
    const { page = 1, limit = 20, status } = req.query;
    
    const query: any = { deviceId };
    if (status) {
      query.status = status;
    }
    
    const payouts = await Payout.find(query)
      .sort({ requestedAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));
    
    const total = await Payout.countDocuments(query);
    
    res.json({
      payouts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get payout history error:', error);
    res.status(500).json({ error: 'Failed to get payout history' });
  }
}

/**
 * Get payout status
 */
export async function getPayoutStatus(req: AuthenticatedRequest, res: Response) {
  try {
    const { deviceId } = req;
    const { payoutId } = req.params;
    
    const payout = await Payout.findOne({
      _id: payoutId,
      deviceId
    });
    
    if (!payout) {
      return res.status(404).json({ error: 'Payout not found' });
    }
    
    res.json({ payout });
  } catch (error) {
    console.error('Get payout status error:', error);
    res.status(500).json({ error: 'Failed to get payout status' });
  }
}

/**
 * Get cooldown status
 */
export async function getCooldownStatus(req: AuthenticatedRequest, res: Response) {
  try {
    const { deviceId } = req;
    
    const cooldown = await Cooldown.findOne({ deviceId });
    const settings = await Settings.findOne();
    
    if (!cooldown) {
      return res.json({
        isOnCooldown: false,
        nextPayoutAt: null,
        cooldownHours: settings?.payoutCooldownHours || 48
      });
    }
    
    const isOnCooldown = cooldown.nextPayoutAt > new Date();
    
    res.json({
      isOnCooldown,
      nextPayoutAt: cooldown.nextPayoutAt,
      reason: cooldown.reason,
      cooldownHours: settings?.payoutCooldownHours || 48
    });
  } catch (error) {
    console.error('Get cooldown status error:', error);
    res.status(500).json({ error: 'Failed to get cooldown status' });
  }
}
