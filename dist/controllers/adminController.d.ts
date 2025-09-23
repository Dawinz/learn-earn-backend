import { Response } from 'express';
/**
 * Admin login - simple development login
 */
export declare function adminLogin(req: any, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get admin dashboard overview
 */
export declare function getDashboard(req: any, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get payout queue
 */
export declare function getPayoutQueue(req: any, res: Response): Promise<void>;
/**
 * Update payout status
 */
export declare function updatePayoutStatus(req: any, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get lessons for admin
 */
export declare function getLessonsAdmin(req: any, res: Response): Promise<void>;
/**
 * Create or update lesson
 */
export declare function saveLesson(req: any, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get settings
 */
export declare function getSettings(req: any, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Update settings
 */
export declare function updateSettings(req: any, res: Response): Promise<void>;
/**
 * Get audit logs
 */
export declare function getAuditLogs(req: any, res: Response): Promise<void>;
/**
 * Get users for admin management
 */
export declare function getUsers(req: any, res: Response): Promise<void>;
/**
 * Block a user
 */
export declare function blockUser(req: any, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Unblock a user
 */
export declare function unblockUser(req: any, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get analytics data
 */
export declare function getAnalytics(req: any, res: Response): Promise<void>;
//# sourceMappingURL=adminController.d.ts.map