import mongoose from 'mongoose';
import Earning from '../models/Earning';
import Settings from '../models/Settings';
import CooldownPeriod from '../models/CooldownPeriod';
import dotenv from 'dotenv';

dotenv.config();

async function testDailyEarningSystem() {
  try {
    await mongoose.connect(process.env.MONGO_URL!);
    console.log('Connected to MongoDB');

    const testDeviceId = 'test_daily_earning_device_123';
    
    console.log('🧪 Testing Daily Earning System\n');

    // Test 1: Check initial daily earning status
    console.log('1. Testing initial daily earning status...');
    const { canEarnToday, applyDailyEarningPause } = await import('../controllers/dailyEarningController');
    
    const initialStatus = await canEarnToday(testDeviceId);
    console.log(`   Can earn initially: ${initialStatus.canEarn}`);
    if (!initialStatus.canEarn) {
      console.log(`   Reason: ${initialStatus.reason}`);
    }

    // Test 2: Simulate progressive earnings
    console.log('\n2. Simulating progressive earnings...');
    
    const settings = await Settings.findOne();
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
      const activePause = await CooldownPeriod.findOne({
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
    
    const { calculateEarningTier, calculatePauseDuration } = await import('../controllers/dailyEarningController');
    
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
    await Earning.create({
      deviceId: testDeviceId,
      source: 'quiz',
      coins: 50,
      usd: 0.05,
      lessonId: 'test_lesson_123'
    });
    
    await Earning.create({
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
    await Earning.deleteMany({ deviceId: testDeviceId });
    await CooldownPeriod.deleteMany({ deviceId: testDeviceId });
    console.log('   Test data cleaned up');

    console.log('\n✅ Daily earning system test completed successfully!');

  } catch (error) {
    console.error('Test error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testDailyEarningSystem();
