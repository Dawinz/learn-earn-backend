"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLessons = getLessons;
exports.getLessonById = getLessonById;
exports.getCategories = getCategories;
exports.getTags = getTags;
exports.searchLessons = searchLessons;
exports.getAdminLessons = getAdminLessons;
exports.updateLesson = updateLesson;
exports.createLesson = createLesson;
exports.deleteLesson = deleteLesson;
const Lesson_1 = __importDefault(require("../models/Lesson"));
const User_1 = __importDefault(require("../models/User"));
/**
 * Get all published lessons
 */
async function getLessons(req, res) {
    try {
        const { category, tags, page = 1, limit = 20 } = req.query;
        const { deviceId } = req;
        const query = { isPublished: true };
        if (category) {
            query.category = category;
        }
        if (tags) {
            const tagArray = tags.split(',');
            query.tags = { $in: tagArray };
        }
        const lessons = await Lesson_1.default.find(query)
            .select('-contentMD') // Exclude full content for list view
            .sort({ createdAt: -1 })
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit));
        // Get user's completed lessons
        const user = await User_1.default.findOne({ deviceId });
        const completedLessons = user?.completedLessons || [];
        // Add completion status to each lesson
        const lessonsWithStatus = lessons.map(lesson => ({
            ...lesson.toObject(),
            isCompleted: completedLessons.includes(lesson._id.toString())
        }));
        const total = await Lesson_1.default.countDocuments(query);
        res.json({
            lessons: lessonsWithStatus,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Get lessons error:', error);
        res.status(500).json({ error: 'Failed to get lessons' });
    }
}
/**
 * Get lesson by ID
 */
async function getLessonById(req, res) {
    try {
        const { lessonId } = req.params;
        const { deviceId } = req;
        const lesson = await Lesson_1.default.findOne({
            _id: lessonId,
            isPublished: true
        });
        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }
        // Get user's completed lessons
        const user = await User_1.default.findOne({ deviceId });
        const completedLessons = user?.completedLessons || [];
        // Add completion status to lesson
        const lessonWithStatus = {
            ...lesson.toObject(),
            isCompleted: completedLessons.includes(lesson._id.toString())
        };
        res.json({ lesson: lessonWithStatus });
    }
    catch (error) {
        console.error('Get lesson error:', error);
        res.status(500).json({ error: 'Failed to get lesson' });
    }
}
/**
 * Get lesson categories
 */
async function getCategories(req, res) {
    try {
        const categories = await Lesson_1.default.aggregate([
            { $match: { isPublished: true } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.json({ categories });
    }
    catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ error: 'Failed to get categories' });
    }
}
/**
 * Get lesson tags
 */
async function getTags(req, res) {
    try {
        const tags = await Lesson_1.default.aggregate([
            { $match: { isPublished: true } },
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.json({ tags });
    }
    catch (error) {
        console.error('Get tags error:', error);
        res.status(500).json({ error: 'Failed to get tags' });
    }
}
/**
 * Search lessons
 */
async function searchLessons(req, res) {
    try {
        const { q, page = 1, limit = 20 } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Search query is required' });
        }
        const query = {
            isPublished: true,
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { summary: { $regex: q, $options: 'i' } },
                { tags: { $in: [new RegExp(q, 'i')] } }
            ]
        };
        const lessons = await Lesson_1.default.find(query)
            .select('-contentMD')
            .sort({ createdAt: -1 })
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit));
        const total = await Lesson_1.default.countDocuments(query);
        res.json({
            lessons,
            query: q,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Search lessons error:', error);
        res.status(500).json({ error: 'Failed to search lessons' });
    }
}
/**
 * Get all lessons for admin (including unpublished)
 */
async function getAdminLessons(req, res) {
    try {
        const { published } = req.query;
        const query = {};
        if (published !== undefined) {
            query.isPublished = published === 'true';
        }
        const lessons = await Lesson_1.default.find(query)
            .sort({ createdAt: -1 });
        res.json({ lessons });
    }
    catch (error) {
        console.error('Get admin lessons error:', error);
        res.status(500).json({ error: 'Failed to get lessons' });
    }
}
/**
 * Update lesson (admin only)
 */
async function updateLesson(req, res) {
    try {
        const { lessonId } = req.params;
        const updateData = req.body;
        const lesson = await Lesson_1.default.findByIdAndUpdate(lessonId, {
            ...updateData,
            updatedAt: new Date()
        }, { new: true, runValidators: true });
        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }
        res.json({ lesson });
    }
    catch (error) {
        console.error('Update lesson error:', error);
        res.status(500).json({ error: 'Failed to update lesson' });
    }
}
/**
 * Create new lesson (admin only)
 */
async function createLesson(req, res) {
    try {
        const lessonData = {
            ...req.body,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const lesson = new Lesson_1.default(lessonData);
        await lesson.save();
        res.status(201).json({ lesson });
    }
    catch (error) {
        console.error('Create lesson error:', error);
        res.status(500).json({ error: 'Failed to create lesson' });
    }
}
/**
 * Delete lesson (admin only)
 */
async function deleteLesson(req, res) {
    try {
        const { lessonId } = req.params;
        const lesson = await Lesson_1.default.findByIdAndDelete(lessonId);
        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }
        res.json({ message: 'Lesson deleted successfully' });
    }
    catch (error) {
        console.error('Delete lesson error:', error);
        res.status(500).json({ error: 'Failed to delete lesson' });
    }
}
//# sourceMappingURL=lessonController.js.map