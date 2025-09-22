import { Router } from 'express';
import { 
  submitQuiz, 
  getQuizHistory, 
  getLessonQuizStats,
  getQuizProgress 
} from '../controllers/quizController';
import { authenticateDevice } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimit';

const router = Router();

// All quiz routes require device authentication
router.use(authenticateDevice);

// Quiz submission and progress routes
router.post('/submit', apiLimiter, submitQuiz);
router.get('/history', getQuizHistory);
router.get('/progress/:lessonId', getQuizProgress);
router.get('/stats/:lessonId', getLessonQuizStats);

export default router;
