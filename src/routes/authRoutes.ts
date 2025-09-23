import { Router } from 'express';
import { 
  signup,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimit';

const router = Router();

// Public routes
router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);
router.post('/forgot-password', authLimiter, forgotPassword);

// Protected routes
router.use(authenticateToken);

router.post('/logout', logout);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

export default router;
