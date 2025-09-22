import { Router } from 'express';
import { 
  getAdMobConfig, 
  recordAdImpression, 
  processAdReward,
  getAdStatistics 
} from '../controllers/adMobController';
import { authenticateDevice } from '../middleware/auth';
import { authenticateAdmin } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimit';

const router = Router();

// Public routes (no auth required)
router.get('/config/:platform', getAdMobConfig);

// Protected routes (require device authentication)
router.use(authenticateDevice);
router.post('/impression', apiLimiter, recordAdImpression);
router.post('/reward', apiLimiter, processAdReward);

// Admin routes (require admin authentication)
router.get('/admin/statistics', authenticateAdmin, getAdStatistics);

export default router;
