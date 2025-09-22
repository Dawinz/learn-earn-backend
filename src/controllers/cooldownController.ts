import { Response } from 'express';
import CooldownPeriod from '../models/CooldownPeriod';
import Settings from '../models/Settings';
import Audit from '../models/Audit';
import { AuthenticatedRequest } from '../middleware/auth';

/**
 * Check if user is in cooldown for a specific action
 */
export async function checkCooldown(req: AuthenticatedRequest, res: Response) {
  try {
    const { deviceId } = req;
    const { action } = req.params;
    
    if (!action) {
      return res.status(400).json({
        error: 'Action parameter is required'
      });
    }
    
    // Get current cooldown for this action
    const cooldown = await CooldownPeriod.findOne({
      deviceId,
      action,
      isActive: true
    });
    
    if (!cooldown) {
      return res.json({
        inCooldown: false,
        cooldown: null
      });
    }
    
    const now = new Date();
    const cooldownEnd = new Date(cooldown.endsAt);
    
    if (now >= cooldownEnd) {
      // Cooldown has expired, deactivate it
      await CooldownPeriod.findByIdAndUpdate(cooldown._id, { isActive: false });
      
      return res.json({
        inCooldown: false,
        cooldown: null
      });
    }
    
    // User is still in cooldown
    const remainingMs = cooldownEnd.getTime() - now.getTime();
    const remainingMinutes = Math.ceil(remainingMs / (1000 * 60));
    
    res.json({
      inCooldown: true,
      cooldown: {
        action: cooldown.action,
        endsAt: cooldown.endsAt,
        remainingMinutes,
        reason: cooldown.reason
      }
    });
  } catch (error) {
    console.error('Check cooldown error:', error);
    res.status(500).json({ error: 'Failed to check cooldown' });
  }
}

/**
 * Start a cooldown period for a user
 */
export async function startCooldown(req: AuthenticatedRequest, res: Response) {
  try {
    const { deviceId } = req;
    const { action, durationMinutes, reason } = req.body;
    
    if (!action || !durationMinutes) {
      return res.status(400).json({
        error: 'Action and duration are required'
      });
    }
    
    // Deactivate any existing cooldown for this action
    await CooldownPeriod.updateMany(
      { deviceId, action, isActive: true },
      { isActive: false }
    );
    
    // Create new cooldown
    const endsAt = new Date();
    endsAt.setMinutes(endsAt.getMinutes() + durationMinutes);
    
    const cooldown = await CooldownPeriod.create({
      deviceId,
      action,
      durationMinutes,
      endsAt,
      reason: reason || 'Manual cooldown',
      isActive: true
    });
    
    // Log the cooldown start
    await Audit.create({
      deviceId,
      action: 'cooldown_started',
      detail: `Action: ${action}, Duration: ${durationMinutes} minutes, Reason: ${reason || 'Manual'}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    res.json({
      success: true,
      cooldown: {
        id: cooldown._id,
        action: cooldown.action,
        durationMinutes: cooldown.durationMinutes,
        endsAt: cooldown.endsAt,
        reason: cooldown.reason
      }
    });
  } catch (error) {
    console.error('Start cooldown error:', error);
    res.status(500).json({ error: 'Failed to start cooldown' });
  }
}

/**
 * End a cooldown period early (admin only)
 */
export async function endCooldown(req: any, res: Response) {
  try {
    const { cooldownId } = req.params;
    
    const cooldown = await CooldownPeriod.findByIdAndUpdate(
      cooldownId,
      { isActive: false },
      { new: true }
    );
    
    if (!cooldown) {
      return res.status(404).json({
        error: 'Cooldown not found'
      });
    }
    
    // Log the cooldown end
    await Audit.create({
      deviceId: cooldown.deviceId,
      action: 'cooldown_ended_early',
      detail: `Cooldown ended by admin: ${cooldown.action}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    res.json({
      success: true,
      message: 'Cooldown ended successfully'
    });
  } catch (error) {
    console.error('End cooldown error:', error);
    res.status(500).json({ error: 'Failed to end cooldown' });
  }
}

/**
 * Get all active cooldowns for a user
 */
export async function getUserCooldowns(req: AuthenticatedRequest, res: Response) {
  try {
    const { deviceId } = req;
    
    const cooldowns = await CooldownPeriod.find({
      deviceId,
      isActive: true
    }).sort({ endsAt: 1 });
    
    const now = new Date();
    const activeCooldowns = cooldowns.map(cooldown => {
      const remainingMs = new Date(cooldown.endsAt).getTime() - now.getTime();
      const remainingMinutes = Math.ceil(remainingMs / (1000 * 60));
      
      return {
        id: cooldown._id,
        action: cooldown.action,
        durationMinutes: cooldown.durationMinutes,
        endsAt: cooldown.endsAt,
        remainingMinutes: Math.max(0, remainingMinutes),
        reason: cooldown.reason,
        isExpired: remainingMs <= 0
      };
    }).filter(cooldown => !cooldown.isExpired);
    
    res.json({
      cooldowns: activeCooldowns,
      total: activeCooldowns.length
    });
  } catch (error) {
    console.error('Get user cooldowns error:', error);
    res.status(500).json({ error: 'Failed to get user cooldowns' });
  }
}

/**
 * Get cooldown statistics for admin
 */
export async function getCooldownStats(req: any, res: Response) {
  try {
    const { startDate, endDate, action } = req.query;
    
    const matchQuery: any = {};
    
    if (startDate && endDate) {
      matchQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (action) {
      matchQuery.action = action;
    }
    
    const stats = await CooldownPeriod.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$action',
          totalCooldowns: { $sum: 1 },
          averageDuration: { $avg: '$durationMinutes' },
          totalDuration: { $sum: '$durationMinutes' }
        }
      }
    ]);
    
    // Get active cooldowns count
    const activeCount = await CooldownPeriod.countDocuments({ isActive: true });
    
    res.json({
      statistics: stats,
      activeCooldowns: activeCount
    });
  } catch (error) {
    console.error('Get cooldown stats error:', error);
    res.status(500).json({ error: 'Failed to get cooldown statistics' });
  }
}

/**
 * Auto-cooldown system for earning actions
 */
export async function applyEarningCooldown(deviceId: string, action: string, settings: any) {
  try {
    let cooldownMinutes = 0;
    let reason = '';
    
    switch (action) {
      case 'quiz':
        cooldownMinutes = 30; // 30 minutes between quiz attempts
        reason = 'Quiz completion cooldown';
        break;
      case 'ad-reward':
        cooldownMinutes = 15; // 15 minutes between ad rewards
        reason = 'Ad reward cooldown';
        break;
      case 'lesson-completion':
        cooldownMinutes = 60; // 1 hour between lesson completions
        reason = 'Lesson completion cooldown';
        break;
      case 'daily-bonus':
        cooldownMinutes = 24 * 60; // 24 hours for daily bonus
        reason = 'Daily bonus cooldown';
        break;
      default:
        cooldownMinutes = 30; // Default 30 minutes
        reason = 'General earning cooldown';
    }
    
    // Deactivate any existing cooldown for this action
    await CooldownPeriod.updateMany(
      { deviceId, action, isActive: true },
      { isActive: false }
    );
    
    // Create new cooldown
    const endsAt = new Date();
    endsAt.setMinutes(endsAt.getMinutes() + cooldownMinutes);
    
    await CooldownPeriod.create({
      deviceId,
      action,
      durationMinutes: cooldownMinutes,
      endsAt,
      reason,
      isActive: true
    });
    
    console.log(`Applied ${cooldownMinutes} minute cooldown for ${action} to device ${deviceId}`);
  } catch (error) {
    console.error('Apply earning cooldown error:', error);
  }
}

/**
 * Check if user can perform earning action
 */
export async function canPerformEarningAction(deviceId: string, action: string): Promise<boolean> {
  try {
    const cooldown = await CooldownPeriod.findOne({
      deviceId,
      action,
      isActive: true
    });
    
    if (!cooldown) {
      return true;
    }
    
    const now = new Date();
    const cooldownEnd = new Date(cooldown.endsAt);
    
    if (now >= cooldownEnd) {
      // Cooldown has expired, deactivate it
      await CooldownPeriod.findByIdAndUpdate(cooldown._id, { isActive: false });
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Can perform earning action error:', error);
    return false; // Fail safe - don't allow if error
  }
}
