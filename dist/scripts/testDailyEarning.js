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
const mongoose_1 = __importDefault(require("mongoose"));
const Earning_1 = __importDefault(require("../models/Earning"));
const Settings_1 = __importDefault(require("../models/Settings"));
const CooldownPeriod_1 = __importDefault(require("../models/CooldownPeriod"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function testDailyEarningSystem() {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');
        const testDeviceId = 'test_daily_earning_device_123';
        console.log('🧪 Testing Daily Earning System\n');
        // Test 1: Check initial daily earning status
        console.log('1. Testing initial daily earning status...');
        const { canEarnToday, applyDailyEarningPause } = await Promise.resolve().then(() => __importStar(require('../controllers/dailyEarningController')));
        const initialStatus = await canEarnToday(testDeviceId);
        console.log(`   Can earn initially: ${initialStatus.canEarn}`);
        if (!initialStatus.canEarn) {
            console.log(`   Reason: ${initialStatus.reason}`);
        }
        // Test 2: Simulate progressive earnings
        console.log('\n2. Simulating progressive earnings...');
        const settings = await Settings_1.default.findOne();
        if (!settings) {
            console.log('   Settings not found, creating test settings...');
            return;
        }
        const maxDailyUsd = settings.maxDailyEarnUsd;
        console.log(`   Max daily USD: $${maxDailyUsd}`);
        // Simulate different earning levels
        const testEarnings = [
            { usd: maxDailyUsd * 0.1, description: '10% of daily cap' },
            { usd: maxDailyUsd * 0.3, description: '30% of daily cap' },
            { usd: maxDailyUsd * 0.6, description: '60% of daily cap' },
            { usd: maxDailyUsd * 0.8, description: '80% of daily cap' },
            { usd: maxDailyUsd * 0.95, description: '95% of daily cap' }
        ];
        for (const testEarning of testEarnings) {
            console.log(`\n   Testing at ${testEarning.description}:`);
            // Apply daily earning pause
            await applyDailyEarningPause(testDeviceId, testEarning.usd, maxDailyUsd);
            // Check if user can still earn
            const canEarn = await canEarnToday(testDeviceId);
            console.log(`   - Can earn: ${canEarn.canEarn}`);
            if (!canEarn.canEarn) {
                console.log(`   - Reason: ${canEarn.reason}`);
                if (canEarn.pauseRemaining) {
                    console.log(`   - Pause remaining: ${canEarn.pauseRemaining} minutes`);
                }
            }
            // Get active pause info
            const activePause = await CooldownPeriod_1.default.findOne({
                deviceId: testDeviceId,
                action: 'daily-earning-pause',
                isActive: true
            });
            if (activePause) {
                const remainingMs = new Date(activePause.endsAt).getTime() - Date.now();
                const remainingMinutes = Math.ceil(remainingMs / (1000 * 60));
                console.log(`   - Active pause: ${activePause.durationMinutes} minutes (${remainingMinutes} remaining)`);
            }
        }
        // Test 3: Test earning tier calculation
        console.log('\n3. Testing earning tier calculation...');
        const { calculateEarningTier, calculatePauseDuration } = await Promise.resolve().then(() => __importStar(require('../controllers/dailyEarningController')));
        const testTiers = [0.1, 0.3, 0.6, 0.8, 0.95, 1.0];
        testTiers.forEach(percentage => {
            const earnedUsd = maxDailyUsd * percentage;
            const tier = calculateEarningTier(earnedUsd, maxDailyUsd);
            const pauseDuration = calculatePauseDuration(tier);
            console.log(`   ${Math.round(percentage * 100)}% of cap: Tier ${tier}, ${pauseDuration} min pause`);
        });
        // Test 4: Test daily earning status endpoint
        console.log('\n4. Testing daily earning status...');
        // Create some test earnings
        await Earning_1.default.create({
            deviceId: testDeviceId,
            source: 'quiz',
            coins: 50,
            usd: 0.05,
            lessonId: 'test_lesson_123'
        });
        await Earning_1.default.create({
            deviceId: testDeviceId,
            source: 'ad-reward',
            coins: 15,
            usd: 0.015,
            adSlotId: 'test_ad_123'
        });
        console.log('   Created test earnings');
        // Check status
        const status = await canEarnToday(testDeviceId);
        console.log(`   Current earning status: ${status.canEarn}`);
        if (!status.canEarn) {
            console.log(`   Reason: ${status.reason}`);
        }
        // Test 5: Clean up test data
        console.log('\n5. Cleaning up test data...');
        await Earning_1.default.deleteMany({ deviceId: testDeviceId });
        await CooldownPeriod_1.default.deleteMany({ deviceId: testDeviceId });
        console.log('   Test data cleaned up');
        console.log('\n✅ Daily earning system test completed successfully!');
    }
    catch (error) {
        console.error('Test error:', error);
    }
    finally {
        await mongoose_1.default.disconnect();
        console.log('Disconnected from MongoDB');
    }
}
testDailyEarningSystem();
//# sourceMappingURL=testDailyEarning.js.map