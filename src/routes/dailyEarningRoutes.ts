import { Router } from 'express';
import { 
  getDailyEarningStatus,
  getDailyEarningStats
} from '../controllers/dailyEarningController';
import { authenticateDevice } from '../middleware/auth';
import { authenticateAdmin } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimit';

const router = Router();

// Device authentication required for user operations
router.use(authenticateDevice);

// User daily earning routes
router.get('/status', getDailyEarningStatus);

// Admin routes (require admin authentication)
router.get('/admin/stats', authenticateAdmin, getDailyEarningStats);

export default router;
