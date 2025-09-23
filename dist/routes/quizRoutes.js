"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quizController_1 = require("../controllers/quizController");
const auth_1 = require("../middleware/auth");
const rateLimit_1 = require("../middleware/rateLimit");
const router = (0, express_1.Router)();
// All quiz routes require device authentication
router.use(auth_1.authenticateDevice);
// Quiz submission and progress routes
router.post('/submit', rateLimit_1.apiLimiter, quizController_1.submitQuiz);
router.get('/history', quizController_1.getQuizHistory);
router.get('/progress/:lessonId', quizController_1.getQuizProgress);
router.get('/stats/:lessonId', quizController_1.getLessonQuizStats);
exports.default = router;
//# sourceMappingURL=quizRoutes.js.map