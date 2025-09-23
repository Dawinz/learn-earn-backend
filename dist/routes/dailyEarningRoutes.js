"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dailyEarningController_1 = require("../controllers/dailyEarningController");
const auth_1 = require("../middleware/auth");
const auth_2 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Device authentication required for user operations
router.use(auth_1.authenticateDevice);
// User daily earning routes
router.get('/status', dailyEarningController_1.getDailyEarningStatus);
// Admin routes (require admin authentication)
router.get('/admin/stats', auth_2.authenticateAdmin, dailyEarningController_1.getDailyEarningStats);
exports.default = router;
//# sourceMappingURL=dailyEarningRoutes.js.map