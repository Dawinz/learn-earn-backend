import { Router } from 'express';
import { 
  registerDevice, 
  setMobileMoneyNumber, 
  getUserProfile 
} from '../controllers/userController';
import { authenticateDevice } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimit';

const router = Router();

// Public routes
router.post('/register', authLimiter, registerDevice);

// Protected routes
router.use(authenticateDevice);

router.get('/profile', getUserProfile);
router.post('/mobile-number', setMobileMoneyNumber);

export default router;
