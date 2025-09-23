"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitQuiz = submitQuiz;
exports.getQuizHistory = getQuizHistory;
exports.getLessonQuizStats = getLessonQuizStats;
exports.getQuizProgress = getQuizProgress;
const QuizSubmission_1 = __importDefault(require("../models/QuizSubmission"));
const Lesson_1 = __importDefault(require("../models/Lesson"));
const Earning_1 = __importDefault(require("../models/Earning"));
const Settings_1 = __importDefault(require("../models/Settings"));
const Audit_1 = __importDefault(require("../models/Audit"));
const economics_1 = require("../utils/economics");
const cooldownController_1 = require("./cooldownController");
const dailyEarningController_1 = require("./dailyEarningController");
/**
 * Submit quiz answers and calculate score
 */
async function submitQuiz(req, res) {
    try {
        const { deviceId } = req;
        const { lessonId, answers, timeSpent } = req.body;
        if (!lessonId || !answers || !Array.isArray(answers)) {
            return res.status(400).json({
                error: 'Lesson ID and answers array are required'
            });
        }
        if (typeof timeSpent !== 'number' || timeSpent < 0) {
            return res.status(400).json({
                error: 'Valid time spent (in seconds) is required'
            });
        }
        // Check if user is in cooldown for quiz actions
        if (!deviceId) {
            return res.status(400).json({
                error: 'Device ID is required'
            });
        }
        const canTakeQuiz = await (0, cooldownController_1.canPerformEarningAction)(deviceId, 'quiz');
        if (!canTakeQuiz) {
            return res.status(429).json({
                error: 'You are in cooldown period. Please wait before taking another quiz.',
                code: 'QUIZ_COOLDOWN_ACTIVE'
            });
        }
        // Check daily earning status
        const dailyEarningStatus = await (0, dailyEarningController_1.canEarnToday)(deviceId);
        if (!dailyEarningStatus.canEarn) {
            return res.status(429).json({
                error: dailyEarningStatus.reason || 'Daily earning limit reached',
                code: 'DAILY_EARNING_LIMIT',
                pauseRemaining: dailyEarningStatus.pauseRemaining
            });
        }
        // Get the lesson with quiz questions
        const lesson = await Lesson_1.default.findOne({
            _id: lessonId,
            isPublished: true
        });
        if (!lesson) {
            return res.status(404).json({
                error: 'Lesson not found or not published'
            });
        }
        if (!lesson.quiz || lesson.quiz.length === 0) {
            return res.status(400).json({
                error: 'This lesson has no quiz'
            });
        }
        // Validate answers array length
        if (answers.length !== lesson.quiz.length) {
            return res.status(400).json({
                error: `Expected ${lesson.quiz.length} answers, got ${answers.length}`
            });
        }
        // Calculate score
        let correctAnswers = 0;
        const quizResults = lesson.quiz.map((question, index) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            if (isCorrect) {
                correctAnswers++;
            }
            return {
                questionIndex: index,
                question: question.question,
                userAnswer,
                correctAnswer: question.correctAnswer,
                isCorrect,
                explanation: question.explanation
            };
        });
        const score = Math.round((correctAnswers / lesson.quiz.length) * 100);
        const passed = score >= 70; // 70% passing threshold
        // Check if user already submitted this quiz
        const existingSubmission = await QuizSubmission_1.default.findOne({
            deviceId,
            lessonId
        });
        if (existingSubmission) {
            return res.status(400).json({
                error: 'Quiz already submitted for this lesson',
                code: 'ALREADY_SUBMITTED',
                previousScore: existingSubmission.score,
                previousPassed: existingSubmission.passed
            });
        }
        // Calculate rewards
        const settings = await Settings_1.default.findOne();
        if (!settings) {
            return res.status(500).json({ error: 'Settings not configured' });
        }
        let coinsEarned = 0;
        let usdEarned = 0;
        if (passed) {
            // Base reward for passing quiz
            coinsEarned = 20; // Base quiz completion reward
            // Bonus for perfect score
            if (score === 100) {
                coinsEarned += 10; // Perfect score bonus
            }
            // Bonus for quick completion (under 2 minutes)
            if (timeSpent < 120) {
                coinsEarned += 5; // Speed bonus
            }
            usdEarned = (0, economics_1.coinsToUsd)(coinsEarned, settings.coinToUsdRate);
            // Check daily earning cap
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const earningsToday = await Earning_1.default.aggregate([
                {
                    $match: {
                        deviceId,
                        createdAt: { $gte: today, $lt: tomorrow }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalUsd: { $sum: '$usd' }
                    }
                }
            ]);
            const totalEarningsToday = earningsToday[0]?.totalUsd || 0;
            if (totalEarningsToday + usdEarned > settings.maxDailyEarnUsd) {
                return res.status(400).json({
                    error: 'Daily earning cap would be exceeded',
                    code: 'DAILY_CAP_EXCEEDED',
                    remaining: settings.maxDailyEarnUsd - totalEarningsToday
                });
            }
            // Create earning record
            await Earning_1.default.create({
                deviceId,
                source: 'quiz',
                coins: coinsEarned,
                usd: usdEarned,
                lessonId
            });
        }
        // Create quiz submission record
        const submission = await QuizSubmission_1.default.create({
            deviceId,
            lessonId,
            answers,
            score,
            passed,
            timeSpent,
            coinsEarned,
            usdEarned
        });
        // Apply cooldown and daily earning pause after successful quiz submission
        if (passed && deviceId) {
            await (0, cooldownController_1.applyEarningCooldown)(deviceId, 'quiz', settings);
            // Apply daily earning pause based on current earnings
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const todayEarnings = await Earning_1.default.aggregate([
                {
                    $match: {
                        deviceId,
                        createdAt: { $gte: today, $lt: tomorrow }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalUsd: { $sum: '$usd' }
                    }
                }
            ]);
            const earnedToday = todayEarnings[0]?.totalUsd || 0;
            await (0, dailyEarningController_1.applyDailyEarningPause)(deviceId, earnedToday, settings.maxDailyEarnUsd);
        }
        // Log the quiz submission
        await Audit_1.default.create({
            deviceId,
            action: 'quiz_submitted',
            detail: `Lesson: ${lesson.title}, Score: ${score}%, Passed: ${passed}, Coins: ${coinsEarned}`,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });
        res.json({
            success: true,
            submission: {
                id: submission._id,
                score,
                passed,
                correctAnswers,
                totalQuestions: lesson.quiz.length,
                coinsEarned,
                usdEarned,
                timeSpent,
                results: quizResults
            }
        });
    }
    catch (error) {
        console.error('Submit quiz error:', error);
        res.status(500).json({ error: 'Failed to submit quiz' });
    }
}
/**
 * Get user's quiz history
 */
async function getQuizHistory(req, res) {
    try {
        const { deviceId } = req;
        const { page = 1, limit = 20, lessonId } = req.query;
        const query = { deviceId };
        if (lessonId) {
            query.lessonId = lessonId;
        }
        const submissions = await QuizSubmission_1.default.find(query)
            .populate('lessonId', 'title category')
            .sort({ createdAt: -1 })
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit));
        const total = await QuizSubmission_1.default.countDocuments(query);
        // Calculate statistics
        const stats = await QuizSubmission_1.default.aggregate([
            { $match: { deviceId } },
            {
                $group: {
                    _id: null,
                    totalQuizzes: { $sum: 1 },
                    passedQuizzes: { $sum: { $cond: ['$passed', 1, 0] } },
                    averageScore: { $avg: '$score' },
                    totalCoinsEarned: { $sum: '$coinsEarned' },
                    totalUsdEarned: { $sum: '$usdEarned' }
                }
            }
        ]);
        res.json({
            submissions,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            },
            statistics: stats[0] || {
                totalQuizzes: 0,
                passedQuizzes: 0,
                averageScore: 0,
                totalCoinsEarned: 0,
                totalUsdEarned: 0
            }
        });
    }
    catch (error) {
        console.error('Get quiz history error:', error);
        res.status(500).json({ error: 'Failed to get quiz history' });
    }
}
/**
 * Get quiz statistics for a specific lesson
 */
async function getLessonQuizStats(req, res) {
    try {
        const { lessonId } = req.params;
        const stats = await QuizSubmission_1.default.aggregate([
            { $match: { lessonId } },
            {
                $group: {
                    _id: null,
                    totalSubmissions: { $sum: 1 },
                    passedSubmissions: { $sum: { $cond: ['$passed', 1, 0] } },
                    averageScore: { $avg: '$score' },
                    averageTimeSpent: { $avg: '$timeSpent' },
                    totalCoinsEarned: { $sum: '$coinsEarned' }
                }
            }
        ]);
        // Get score distribution
        const scoreDistribution = await QuizSubmission_1.default.aggregate([
            { $match: { lessonId } },
            {
                $bucket: {
                    groupBy: '$score',
                    boundaries: [0, 25, 50, 70, 85, 100],
                    default: 'Other',
                    output: {
                        count: { $sum: 1 }
                    }
                }
            }
        ]);
        res.json({
            lessonId,
            statistics: stats[0] || {
                totalSubmissions: 0,
                passedSubmissions: 0,
                averageScore: 0,
                averageTimeSpent: 0,
                totalCoinsEarned: 0
            },
            scoreDistribution
        });
    }
    catch (error) {
        console.error('Get lesson quiz stats error:', error);
        res.status(500).json({ error: 'Failed to get lesson quiz statistics' });
    }
}
/**
 * Get user's quiz progress for a specific lesson
 */
async function getQuizProgress(req, res) {
    try {
        const { deviceId } = req;
        const { lessonId } = req.params;
        const submission = await QuizSubmission_1.default.findOne({
            deviceId,
            lessonId
        });
        if (!submission) {
            return res.json({
                hasSubmitted: false,
                progress: null
            });
        }
        res.json({
            hasSubmitted: true,
            progress: {
                score: submission.score,
                passed: submission.passed,
                timeSpent: submission.timeSpent,
                coinsEarned: submission.coinsEarned,
                submittedAt: submission.createdAt
            }
        });
    }
    catch (error) {
        console.error('Get quiz progress error:', error);
        res.status(500).json({ error: 'Failed to get quiz progress' });
    }
}
//# sourceMappingURL=quizController.js.map