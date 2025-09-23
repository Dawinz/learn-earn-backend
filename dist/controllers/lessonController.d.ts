import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
/**
 * Get all published lessons
 */
export declare function getLessons(req: AuthenticatedRequest, res: Response): Promise<void>;
/**
 * Get lesson by ID
 */
export declare function getLessonById(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get lesson categories
 */
export declare function getCategories(req: AuthenticatedRequest, res: Response): Promise<void>;
/**
 * Get lesson tags
 */
export declare function getTags(req: AuthenticatedRequest, res: Response): Promise<void>;
/**
 * Search lessons
 */
export declare function searchLessons(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get all lessons for admin (including unpublished)
 */
export declare function getAdminLessons(req: AuthenticatedRequest, res: Response): Promise<void>;
/**
 * Update lesson (admin only)
 */
export declare function updateLesson(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Create new lesson (admin only)
 */
export declare function createLesson(req: AuthenticatedRequest, res: Response): Promise<void>;
/**
 * Delete lesson (admin only)
 */
export declare function deleteLesson(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=lessonController.d.ts.map