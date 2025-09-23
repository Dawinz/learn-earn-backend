"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cooldownController_1 = require("../controllers/cooldownController");
const auth_1 = require("../middleware/auth");
const auth_2 = require("../middleware/auth");
const rateLimit_1 = require("../middleware/rateLimit");
const router = (0, express_1.Router)();
// Device authentication required for user cooldown operations
router.use(auth_1.authenticateDevice);
// User cooldown routes
router.get('/check/:action', cooldownController_1.checkCooldown);
router.post('/start', rateLimit_1.apiLimiter, cooldownController_1.startCooldown);
router.get('/user', cooldownController_1.getUserCooldowns);
// Admin routes (require admin authentication)
router.delete('/:cooldownId', auth_2.authenticateAdmin, cooldownController_1.endCooldown);
router.get('/admin/stats', auth_2.authenticateAdmin, cooldownController_1.getCooldownStats);
exports.default = router;
//# sourceMappingURL=cooldownRoutes.js.map