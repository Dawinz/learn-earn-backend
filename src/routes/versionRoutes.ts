import { Router } from 'express';
import { getVersionInfo, updateVersionInfo } from '../controllers/versionController';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

// Public route - anyone can check version
router.get('/', getVersionInfo);

// Admin route - update version requirements
router.put('/', authenticateAdmin, updateVersionInfo);

export default router;
