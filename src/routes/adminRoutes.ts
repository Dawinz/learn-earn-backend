import { Router } from 'express';
import { 
  adminLogin,
  getDashboard,
  getPayoutQueue,
  updatePayoutStatus,
  getSettings,
  updateSettings,
  getAuditLogs,
  getUsers,
  blockUser,
  unblockUser,
  getAnalytics
} from '../controllers/adminController';
import { 
  getAdminLessons,
  updateLesson,
  createLesson,
  deleteLesson
} from '../controllers/lessonController';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

// Login route (no auth required)
router.post('/login', adminLogin);

// All other admin routes require admin authentication
router.use(authenticateAdmin);

router.get('/dashboard', getDashboard);
router.get('/payouts', getPayoutQueue);
router.put('/payouts/:payoutId', updatePayoutStatus);
router.get('/lessons', getAdminLessons);
router.post('/lessons', createLesson);
router.put('/lessons/:lessonId', updateLesson);
router.delete('/lessons/:lessonId', deleteLesson);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.get('/audits', getAuditLogs);
router.get('/users', getUsers);
router.put('/users/:userId/block', blockUser);
router.put('/users/:userId/unblock', unblockUser);
router.get('/analytics', getAnalytics);

export default router;
