"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const rateLimit_1 = require("../middleware/rateLimit");
const router = (0, express_1.Router)();
// Public routes
router.post('/register', rateLimit_1.authLimiter, userController_1.registerDevice);
// Protected routes
router.use(auth_1.authenticateDevice);
router.get('/profile', userController_1.getUserProfile);
router.post('/mobile-number', userController_1.setMobileMoneyNumber);
router.get('/progress', userController_1.getUserProgress);
router.post('/progress/reset', userController_1.performDailyReset);
router.post('/lessons/:lessonId/complete', userController_1.completeLesson);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map