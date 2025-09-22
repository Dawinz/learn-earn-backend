import { Router } from 'express';
import { 
  checkCooldown, 
  startCooldown, 
  endCooldown,
  getUserCooldowns,
  getCooldownStats
} from '../controllers/cooldownController';
import { authenticateDevice } from '../middleware/auth';
import { authenticateAdmin } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimit';

const router = Router();

// Device authentication required for user cooldown operations
router.use(authenticateDevice);

// User cooldown routes
router.get('/check/:action', checkCooldown);
router.post('/start', apiLimiter, startCooldown);
router.get('/user', getUserCooldowns);

// Admin routes (require admin authentication)
router.delete('/:cooldownId', authenticateAdmin, endCooldown);
router.get('/admin/stats', authenticateAdmin, getCooldownStats);

export default router;
