"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lessonController_1 = require("../controllers/lessonController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All lesson routes require authentication
router.use(auth_1.authenticateDevice);
router.get('/', lessonController_1.getLessons);
router.get('/search', lessonController_1.searchLessons);
router.get('/categories', lessonController_1.getCategories);
router.get('/tags', lessonController_1.getTags);
router.get('/:lessonId', lessonController_1.getLessonById);
exports.default = router;
//# sourceMappingURL=lessonRoutes.js.map