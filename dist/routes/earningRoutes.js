"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const earningController_1 = require("../controllers/earningController");
const auth_1 = require("../middleware/auth");
const rateLimit_1 = require("../middleware/rateLimit");
const router = (0, express_1.Router)();
// All earning routes require authentication
router.use(auth_1.authenticateDevice);
router.post('/record', rateLimit_1.earningLimiter, earningController_1.recordEarning);
router.get('/history', earningController_1.getEarningsHistory);
router.get('/daily', earningController_1.getDailyEarnings);
exports.default = router;
//# sourceMappingURL=earningRoutes.js.map