"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const rateLimit_1 = require("./middleware/rateLimit");
// Import routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const earningRoutes_1 = __importDefault(require("./routes/earningRoutes"));
const payoutRoutes_1 = __importDefault(require("./routes/payoutRoutes"));
const lessonRoutes_1 = __importDefault(require("./routes/lessonRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const adMobRoutes_1 = __importDefault(require("./routes/adMobRoutes"));
const quizRoutes_1 = __importDefault(require("./routes/quizRoutes"));
const cooldownRoutes_1 = __importDefault(require("./routes/cooldownRoutes"));
const dailyEarningRoutes_1 = __importDefault(require("./routes/dailyEarningRoutes"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? [
            'https://learn-earn-admin-otyulpxc5-dawson-s-projects.vercel.app',
            'https://learn-earn-admin.vercel.app',
            'https://learn-earn-admin-dawson-s-projects.vercel.app',
            'https://your-mobile-app.com',
            // Add your mobile app domains here when you deploy
            'http://localhost:3000', // For local development
            'http://localhost:8080', // For local development
            'http://localhost:3001', // For local development
            'http://127.0.0.1:3000',
            'http://127.0.0.1:8080',
            'http://127.0.0.1:3001'
        ]
        : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers'
    ],
    exposedHeaders: ['Authorization'],
    optionsSuccessStatus: 200
}));
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Rate limiting
app.use(rateLimit_1.apiLimiter);
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
// API routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/earnings', earningRoutes_1.default);
app.use('/api/payouts', payoutRoutes_1.default);
app.use('/api/lessons', lessonRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/ads', adMobRoutes_1.default);
app.use('/api/quiz', quizRoutes_1.default);
app.use('/api/cooldown', cooldownRoutes_1.default);
app.use('/api/daily-earning', dailyEarningRoutes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Invalid JSON' });
    }
    if (err.type === 'entity.too.large') {
        return res.status(413).json({ error: 'Request too large' });
    }
    res.status(500).json({
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message
    });
});
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
// Connect to MongoDB and start server
async function startServer() {
    try {
        const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/learn_earn';
        await mongoose_1.default.connect(mongoUrl);
        console.log('Connected to MongoDB');
        // Initialize default settings if they don't exist
        const SettingsModule = await Promise.resolve().then(() => __importStar(require('./models/Settings')));
        const Settings = SettingsModule.default;
        const existingSettings = await Settings.findOne();
        if (!existingSettings) {
            await Settings.create({
                minPayoutUsd: parseFloat(process.env.MIN_PAYOUT_USD || '5'),
                payoutCooldownHours: parseInt(process.env.PAYOUT_COOLDOWN_HOURS || '48'),
                maxDailyEarnUsd: parseFloat(process.env.MAX_DAILY_EARN_USD || '0.5'),
                safetyMargin: parseFloat(process.env.SAFETY_MARGIN || '0.6'),
                eCPM_USD: parseFloat(process.env.ECPM_USD || '1.5'),
                impressionsToday: 0,
                appPepper: process.env.APP_PEPPER || 'default_pepper_change_me',
                emulatorPayouts: process.env.EMULATOR_PAYOUTS === 'true',
                coinToUsdRate: 0.001
            });
            console.log('Default settings initialized');
        }
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
// Handle graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await mongoose_1.default.connection.close();
    process.exit(0);
});
process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    await mongoose_1.default.connection.close();
    process.exit(0);
});
startServer();
//# sourceMappingURL=index.js.map