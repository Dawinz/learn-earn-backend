"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const rateLimit_1 = require("../middleware/rateLimit");
const router = (0, express_1.Router)();
// Public routes
router.post('/signup', rateLimit_1.authLimiter, authController_1.signup);
router.post('/login', rateLimit_1.authLimiter, authController_1.login);
router.post('/forgot-password', rateLimit_1.authLimiter, authController_1.forgotPassword);
// Protected routes
router.use(auth_1.authenticateToken);
router.post('/logout', authController_1.logout);
router.get('/profile', authController_1.getProfile);
router.put('/profile', authController_1.updateProfile);
router.put('/change-password', authController_1.changePassword);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map