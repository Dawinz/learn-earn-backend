import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
/**
 * Register a new device
 */
export declare function registerDevice(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Set mobile money number (with 30-day lock)
 */
export declare function setMobileMoneyNumber(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get user profile
 */
export declare function getUserProfile(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Complete a lesson
 */
export declare function completeLesson(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get user progress
 */
export declare function getUserProgress(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Perform daily reset
 */
export declare function performDailyReset(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=userController.d.ts.map