import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';
export interface AuthenticatedRequest extends Request {
    user?: IUser;
    deviceId?: string;
    userId?: string;
}
/**
 * Verify device signature and authenticate user
 */
export declare function authenticateDevice(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Verify JWT token for authenticated users
 */
export declare function authenticateToken(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Verify admin JWT token
 */
export declare function authenticateAdmin(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
/**
 * Check if device is emulator and if payouts are allowed
 */
export declare function checkEmulatorPayoutPolicy(req: AuthenticatedRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.d.ts.map