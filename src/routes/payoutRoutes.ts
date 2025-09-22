import { Router } from 'express';
import { 
  requestPayout, 
  getPayoutHistory, 
  getPayoutStatus,
  getCooldownStatus 
} from '../controllers/payoutController';
import { authenticateDevice, checkEmulatorPayoutPolicy } from '../middleware/auth';
import { payoutLimiter } from '../middleware/rateLimit';

const router = Router();

// All payout routes require authentication
router.use(authenticateDevice);

router.post('/request', payoutLimiter, checkEmulatorPayoutPolicy, requestPayout);
router.get('/history', getPayoutHistory);
router.get('/status/:payoutId', getPayoutStatus);
router.get('/cooldown', getCooldownStatus);

export default router;
