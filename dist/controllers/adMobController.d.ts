import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
/**
 * Get AdMob configuration for mobile app
 */
export declare function getAdMobConfig(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Record ad impression (for analytics)
 */
export declare function recordAdImpression(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Process ad reward (when user completes rewarded video)
 */
export declare function processAdReward(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get ad statistics for admin
 */
export declare function getAdStatistics(req: any, res: Response): Promise<void>;
//# sourceMappingURL=adMobController.d.ts.map