import { Request, Response } from 'express';
/**
 * Sign up a new user
 */
export declare const signup: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Login user
 */
export declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Logout user
 */
export declare const logout: (req: Request, res: Response) => Promise<void>;
/**
 * Get user profile
 */
export declare const getProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Update user profile
 */
export declare const updateProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Change password
 */
export declare const changePassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Forgot password
 */
export declare const forgotPassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=authController.d.ts.map