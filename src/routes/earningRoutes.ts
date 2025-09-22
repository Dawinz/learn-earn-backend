import { Router } from 'express';
import { 
  recordEarning, 
  getEarningsHistory, 
  getDailyEarnings 
} from '../controllers/earningController';
import { authenticateDevice } from '../middleware/auth';
import { earningLimiter } from '../middleware/rateLimit';

const router = Router();

// All earning routes require authentication
router.use(authenticateDevice);

router.post('/record', earningLimiter, recordEarning);
router.get('/history', getEarningsHistory);
router.get('/daily', getDailyEarnings);

export default router;
