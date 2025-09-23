import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
/**
 * Record an earning (coins earned from lesson, quiz, etc.)
 */
export declare function recordEarning(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get user's earnings history
 */
export declare function getEarningsHistory(req: AuthenticatedRequest, res: Response): Promise<void>;
/**
 * Get daily earnings summary
 */
export declare function getDailyEarnings(req: AuthenticatedRequest, res: Response): Promise<void>;
//# sourceMappingURL=earningController.d.ts.map