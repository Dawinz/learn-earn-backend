"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payoutController_1 = require("../controllers/payoutController");
const auth_1 = require("../middleware/auth");
const rateLimit_1 = require("../middleware/rateLimit");
const router = (0, express_1.Router)();
// All payout routes require authentication
router.use(auth_1.authenticateDevice);
router.post('/request', rateLimit_1.payoutLimiter, auth_1.checkEmulatorPayoutPolicy, payoutController_1.requestPayout);
router.get('/history', payoutController_1.getPayoutHistory);
router.get('/status/:payoutId', payoutController_1.getPayoutStatus);
router.get('/cooldown', payoutController_1.getCooldownStatus);
exports.default = router;
//# sourceMappingURL=payoutRoutes.js.map