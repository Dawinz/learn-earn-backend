import { Response } from 'express';
import User from '../models/User';
import AuthUser from '../models/AuthUser';
import Payout from '../models/Payout';
import Settings from '../models/Settings';
import Lesson from '../models/Lesson';
import Earning from '../models/Earning';
import Audit from '../models/Audit';
import { calculateDailyBudget } from '../utils/economics';
import jwt from 'jsonwebtoken';

/**
 * Admin login - simple development login
 */
export async function adminLogin(req: any, res: Response) {
  try {
    const { username, password } = req.body;
    
    // Simple hardcoded admin credentials for development
    if (username === 'admin' && password === 'admin123') {
      const token = jwt.sign(
        { id: 'admin', username: 'admin' },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );
      
      return res.json({
        success: true,
        token,
        user: { id: 'admin', username: 'admin' }
      });
    }
    
    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
}

/**
 * Get admin dashboard overview
 */
export async function getDashboard(req: any, res: Response) {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(500).json({ error: 'Settings not configured' });
    }
    
    const budget = calculateDailyBudget(settings);
    
    // Get today's payouts
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const payoutsToday = await Payout.aggregate([
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
    const pendingPayouts = await Payout.find({ status: 'pending' })
      .sort({ requestedAt: 1 })
      .limit(10);
    
    // Get recent earnings
    const recentEarnings = await Earning.aggregate([
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
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard data' });
  }
}

/**
 * Get payout queue
 */
export async function getPayoutQueue(req: any, res: Response) {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query: any = {};
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
    console.error('Get payout queue error:', error);
    res.status(500).json({ error: 'Failed to get payout queue' });
  }
}

/**
 * Update payout status
 */
export async function updatePayoutStatus(req: any, res: Response) {
  try {
    const { payoutId } = req.params;
    const { status, txRef, adminNotes, reason } = req.body;
    
    if (!['pending', 'paid', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const payout = await Payout.findById(payoutId);
    if (!payout) {
      return res.status(404).json({ error: 'Payout not found' });
    }
    
    const updateData: any = { status };
    if (txRef) updateData.txRef = txRef;
    if (adminNotes) updateData.adminNotes = adminNotes;
    if (reason) updateData.reason = reason;
    
    if (status === 'paid') {
      updateData.paidAt = new Date();
    }
    
    const updatedPayout = await Payout.findByIdAndUpdate(
      payoutId,
      updateData,
      { new: true }
    );
    
    // Log the action
    await Audit.create({
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
  } catch (error) {
    console.error('Update payout status error:', error);
    res.status(500).json({ error: 'Failed to update payout status' });
  }
}

/**
 * Get lessons for admin
 */
export async function getLessonsAdmin(req: any, res: Response) {
  try {
    const { page = 1, limit = 20, published } = req.query;
    
    const query: any = {};
    if (published !== undefined) {
      query.isPublished = published === 'true';
    }
    
    const lessons = await Lesson.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));
    
    const total = await Lesson.countDocuments(query);
    
    res.json({
      lessons,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get lessons admin error:', error);
    res.status(500).json({ error: 'Failed to get lessons' });
  }
}

/**
 * Create or update lesson
 */
export async function saveLesson(req: any, res: Response) {
  try {
    const { lessonId, ...lessonData } = req.body;
    
    if (lessonId) {
      // Update existing lesson
      const lesson = await Lesson.findByIdAndUpdate(
        lessonId,
        { ...lessonData, updatedAt: new Date() },
        { new: true }
      );
      
      if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' });
      }
      
      res.json({ success: true, lesson });
    } else {
      // Create new lesson
      const lesson = await Lesson.create(lessonData);
      res.status(201).json({ success: true, lesson });
    }
  } catch (error) {
    console.error('Save lesson error:', error);
    res.status(500).json({ error: 'Failed to save lesson' });
  }
}

/**
 * Get settings
 */
export async function getSettings(req: any, res: Response) {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ error: 'Settings not found' });
    }
    
    res.json({ settings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get settings' });
  }
}

/**
 * Update settings
 */
export async function updateSettings(req: any, res: Response) {
  try {
    const settingsData = req.body;
    
    const settings = await Settings.findOneAndUpdate(
      {},
      { ...settingsData, lastUpdated: new Date() },
      { upsert: true, new: true }
    );
    
    res.json({ success: true, settings });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
}

/**
 * Get audit logs
 */
export async function getAuditLogs(req: any, res: Response) {
  try {
    const { deviceId, action, page = 1, limit = 50 } = req.query;
    
    const query: any = {};
    if (deviceId) query.deviceId = deviceId;
    if (action) query.action = action;
    
    const audits = await Audit.find(query)
      .sort({ timestamp: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));
    
    const total = await Audit.countDocuments(query);
    
    res.json({
      audits,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ error: 'Failed to get audit logs' });
  }
}

/**
 * Get users for admin management
 */
export async function getUsers(req: any, res: Response) {
  try {
    const { page = 1, limit = 20, filter, status, sortKey = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Build query for both User and AuthUser collections
    const userQuery: any = {};
    const authUserQuery: any = {};
    
    if (filter) {
      userQuery.deviceId = { $regex: filter, $options: 'i' };
      authUserQuery.$or = [
        { email: { $regex: filter, $options: 'i' } },
        { name: { $regex: filter, $options: 'i' } }
      ];
    }
    if (status && status !== 'all') {
      userQuery.status = status;
      // AuthUsers don't have status field, so we'll handle this in the aggregation
    }
    
    // Build sort object
    const sort: any = {};
    sort[sortKey as string] = sortOrder === 'asc' ? 1 : -1;
    
    // Get device-based users (original system)
    const deviceUsers = await User.aggregate([
      { $match: userQuery },
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
          lastActivity: { $max: ['$lastActivity', { $max: '$earnings.createdAt' }] },
          userType: 'device',
          displayId: '$deviceId',
          displayName: { $concat: ['Device: ', '$deviceId'] }
        }
      },
      {
        $project: {
          _id: 1,
          deviceId: 1,
          status: 1,
          totalEarningsUsd: 1,
          totalPayoutsUsd: 1,
          lastActivity: 1,
          createdAt: 1,
          userType: 1,
          displayId: 1,
          displayName: 1
        }
      }
    ]);
    
    // Get email-based users (mobile app signups)
    const authUsers = await AuthUser.aggregate([
      { $match: authUserQuery },
      {
        $lookup: {
          from: 'earnings',
          localField: '_id',
          foreignField: 'userId',
          as: 'earnings'
        }
      },
      {
        $lookup: {
          from: 'payouts',
          localField: '_id',
          foreignField: 'userId',
          as: 'payouts'
        }
      },
      {
        $addFields: {
          totalEarningsUsd: { $sum: '$earnings.amountUsd' },
          totalPayoutsUsd: { $sum: '$payouts.amountUsd' },
          lastActivity: { $max: ['$lastLoginAt', { $max: '$earnings.createdAt' }] },
          userType: 'email',
          displayId: '$email',
          displayName: '$name',
          status: 'active' // AuthUsers are always active unless blocked
        }
      },
      {
        $project: {
          _id: 1,
          email: 1,
          name: 1,
          phoneNumber: 1,
          isEmailVerified: 1,
          totalEarningsUsd: 1,
          totalPayoutsUsd: 1,
          lastActivity: 1,
          createdAt: 1,
          userType: 1,
          displayId: 1,
          displayName: 1,
          status: 1
        }
      }
    ]);
    
    // Combine both user types
    let allUsers = [...deviceUsers, ...authUsers];
    
    // Apply status filter for combined results
    if (status && status !== 'all') {
      allUsers = allUsers.filter(user => user.status === status);
    }
    
    // Sort combined results
    allUsers.sort((a, b) => {
      const aValue = a[sortKey as string];
      const bValue = b[sortKey as string];
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    // Apply pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedUsers = allUsers.slice(startIndex, endIndex);
    
    res.json({
      users: paginatedUsers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: allUsers.length,
        pages: Math.ceil(allUsers.length / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
}

/**
 * Block a user
 */
export async function blockUser(req: any, res: Response) {
  try {
    const { userId } = req.params;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { status: 'blocked', updatedAt: new Date() },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Log the action
    await Audit.create({
      deviceId: user.deviceId,
      action: 'user_blocked',
      details: { blockedBy: 'admin', reason: 'Manual block' }
    });
    
    res.json({ message: 'User blocked successfully', user });
  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({ error: 'Failed to block user' });
  }
}

/**
 * Unblock a user
 */
export async function unblockUser(req: any, res: Response) {
  try {
    const { userId } = req.params;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { status: 'active', updatedAt: new Date() },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Log the action
    await Audit.create({
      deviceId: user.deviceId,
      action: 'user_unblocked',
      details: { unblockedBy: 'admin', reason: 'Manual unblock' }
    });
    
    res.json({ message: 'User unblocked successfully', user });
  } catch (error) {
    console.error('Unblock user error:', error);
    res.status(500).json({ error: 'Failed to unblock user' });
  }
}

/**
 * Get analytics data
 */
export async function getAnalytics(req: any, res: Response) {
  try {
    // Count both types of users
    const deviceUsers = await User.countDocuments();
    const authUsers = await AuthUser.countDocuments();
    const totalUsers = deviceUsers + authUsers;
    
    const activeUsers = await User.countDocuments({ status: 'active' }) + authUsers; // AuthUsers are always active
    const blockedUsers = await User.countDocuments({ status: 'blocked' });
    
    const totalEarnings = await Earning.aggregate([
      { $group: { _id: null, total: { $sum: '$amountUsd' } } }
    ]);
    
    const totalPayouts = await Payout.aggregate([
      { $group: { _id: null, total: { $sum: '$amountUsd' } } }
    ]);
    
    const recentEarnings = await Earning.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'deviceId email name')
      .select('amountUsd source createdAt userId');
    
    const recentPayouts = await Payout.find()
      .sort({ requestedAt: -1 })
      .limit(10)
      .populate('userId', 'deviceId email name')
      .select('amountUsd status requestedAt paidAt userId');
    
    res.json({
      totalUsers,
      activeUsers,
      blockedUsers,
      totalEarningsUsd: totalEarnings[0]?.total || 0,
      totalPayoutsUsd: totalPayouts[0]?.total || 0,
      recentEarnings,
      recentPayouts
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
}
