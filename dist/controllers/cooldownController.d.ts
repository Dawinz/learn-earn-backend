import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
/**
 * Check if user is in cooldown for a specific action
 */
export declare function checkCooldown(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Start a cooldown period for a user
 */
export declare function startCooldown(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * End a cooldown period early (admin only)
 */
export declare function endCooldown(req: any, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get all active cooldowns for a user
 */
export declare function getUserCooldowns(req: AuthenticatedRequest, res: Response): Promise<void>;
/**
 * Get cooldown statistics for admin
 */
export declare function getCooldownStats(req: any, res: Response): Promise<void>;
/**
 * Auto-cooldown system for earning actions
 */
export declare function applyEarningCooldown(deviceId: string, action: string, settings: any): Promise<void>;
/**
 * Check if user can perform earning action
 */
export declare function canPerformEarningAction(deviceId: string, action: string): Promise<boolean>;
//# sourceMappingURL=cooldownController.d.ts.map