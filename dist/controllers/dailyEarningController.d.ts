import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
/**
 * Check daily earning status and get remaining capacity
 */
export declare function getDailyEarningStatus(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Apply smart daily earning pause based on current earnings
 */
export declare function applyDailyEarningPause(deviceId: string, earnedUsd: number, maxDailyUsd: number): Promise<void>;
/**
 * Check if user can earn (not in pause and under limits)
 */
export declare function canEarnToday(deviceId: string): Promise<{
    canEarn: boolean;
    reason?: string;
    pauseRemaining?: number;
}>;
/**
 * Calculate earning tier based on percentage of daily cap reached
 */
export declare function calculateEarningTier(earnedUsd: number, maxDailyUsd: number): number;
/**
 * Calculate pause duration based on earning tier
 */
export declare function calculatePauseDuration(tier: number): number;
/**
 * Get daily earning statistics for admin
 */
export declare function getDailyEarningStats(req: any, res: Response): Promise<void>;
//# sourceMappingURL=dailyEarningController.d.ts.map