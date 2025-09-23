import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { apiLimiter } from './middleware/rateLimit';

// Import routes
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import earningRoutes from './routes/earningRoutes';
import payoutRoutes from './routes/payoutRoutes';
import lessonRoutes from './routes/lessonRoutes';
import adminRoutes from './routes/adminRoutes';
import adMobRoutes from './routes/adMobRoutes';
import quizRoutes from './routes/quizRoutes';
import cooldownRoutes from './routes/cooldownRoutes';
import dailyEarningRoutes from './routes/dailyEarningRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Security middleware
app.use(helmet());
app.use(cors({
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
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(apiLimiter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/earnings', earningRoutes);
app.use('/api/payouts', payoutRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ads', adMobRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/cooldown', cooldownRoutes);
app.use('/api/daily-earning', dailyEarningRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Connect to MongoDB and start server
async function startServer() {
  try {
    const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/learn_earn';
    await mongoose.connect(mongoUrl);
    console.log('Connected to MongoDB');
    
    // Initialize default settings if they don't exist
    const SettingsModule = await import('./models/Settings');
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
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await mongoose.connection.close();
  process.exit(0);
});

startServer();
