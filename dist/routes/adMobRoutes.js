"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adMobController_1 = require("../controllers/adMobController");
const auth_1 = require("../middleware/auth");
const auth_2 = require("../middleware/auth");
const rateLimit_1 = require("../middleware/rateLimit");
const router = (0, express_1.Router)();
// Public routes (no auth required)
router.get('/config/:platform', adMobController_1.getAdMobConfig);
// Protected routes (require device authentication)
router.use(auth_1.authenticateDevice);
router.post('/impression', rateLimit_1.apiLimiter, adMobController_1.recordAdImpression);
router.post('/reward', rateLimit_1.apiLimiter, adMobController_1.processAdReward);
// Admin routes (require admin authentication)
router.get('/admin/statistics', auth_2.authenticateAdmin, adMobController_1.getAdStatistics);
exports.default = router;
//# sourceMappingURL=adMobRoutes.js.map