import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
/**
 * Submit quiz answers and calculate score
 */
export declare function submitQuiz(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get user's quiz history
 */
export declare function getQuizHistory(req: AuthenticatedRequest, res: Response): Promise<void>;
/**
 * Get quiz statistics for a specific lesson
 */
export declare function getLessonQuizStats(req: AuthenticatedRequest, res: Response): Promise<void>;
/**
 * Get user's quiz progress for a specific lesson
 */
export declare function getQuizProgress(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=quizController.d.ts.map