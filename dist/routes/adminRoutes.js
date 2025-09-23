"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const lessonController_1 = require("../controllers/lessonController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Login route (no auth required)
router.post('/login', adminController_1.adminLogin);
// All other admin routes require admin authentication
router.use(auth_1.authenticateAdmin);
router.get('/dashboard', adminController_1.getDashboard);
router.get('/payouts', adminController_1.getPayoutQueue);
router.put('/payouts/:payoutId', adminController_1.updatePayoutStatus);
router.get('/lessons', lessonController_1.getAdminLessons);
router.post('/lessons', lessonController_1.createLesson);
router.put('/lessons/:lessonId', lessonController_1.updateLesson);
router.delete('/lessons/:lessonId', lessonController_1.deleteLesson);
router.get('/settings', adminController_1.getSettings);
router.put('/settings', adminController_1.updateSettings);
router.get('/audits', adminController_1.getAuditLogs);
router.get('/users', adminController_1.getUsers);
router.put('/users/:userId/block', adminController_1.blockUser);
router.put('/users/:userId/unblock', adminController_1.unblockUser);
router.get('/analytics', adminController_1.getAnalytics);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map