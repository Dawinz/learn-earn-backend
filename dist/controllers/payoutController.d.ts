import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
/**
 * Request a payout
 */
export declare function requestPayout(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get payout history
 */
export declare function getPayoutHistory(req: AuthenticatedRequest, res: Response): Promise<void>;
/**
 * Get payout status
 */
export declare function getPayoutStatus(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get cooldown status
 */
export declare function getCooldownStatus(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=payoutController.d.ts.map