import mongoose from 'mongoose';
import CooldownPeriod from '../models/CooldownPeriod';
import Settings from '../models/Settings';
import dotenv from 'dotenv';

dotenv.config();

async function testCooldownSystem() {
  try {
    await mongoose.connect(process.env.MONGO_URL!);
    console.log('Connected to MongoDB');

    const testDeviceId = 'test_cooldown_device_123';
    
    console.log('🧪 Testing Cooldown System\n');

    // Test 1: Check cooldown when none exists
    console.log('1. Testing initial cooldown check...');
    const initialCooldown = await CooldownPeriod.findOne({
      deviceId: testDeviceId,
      action: 'quiz',
      isActive: true
    });
    console.log(`   Initial cooldown exists: ${!!initialCooldown}`);

    // Test 2: Create a quiz cooldown
    console.log('\n2. Creating quiz cooldown (30 minutes)...');
    const quizCooldown = await CooldownPeriod.create({
      deviceId: testDeviceId,
      action: 'quiz',
      durationMinutes: 30,
      endsAt: new Date(Date.now() + 30 * 60 * 1000),
      reason: 'Quiz completion cooldown',
      isActive: true
    });
    console.log(`   Quiz cooldown created: ${quizCooldown._id}`);

    // Test 3: Create an ad reward cooldown
    console.log('\n3. Creating ad reward cooldown (15 minutes)...');
    const adCooldown = await CooldownPeriod.create({
      deviceId: testDeviceId,
      action: 'ad-reward',
      durationMinutes: 15,
      endsAt: new Date(Date.now() + 15 * 60 * 1000),
      reason: 'Ad reward cooldown',
      isActive: true
    });
    console.log(`   Ad cooldown created: ${adCooldown._id}`);

    // Test 4: Get user's active cooldowns
    console.log('\n4. Getting user active cooldowns...');
    const activeCooldowns = await CooldownPeriod.find({
      deviceId: testDeviceId,
      isActive: true
    }).sort({ endsAt: 1 });

    console.log(`   Active cooldowns: ${activeCooldowns.length}`);
    activeCooldowns.forEach(cooldown => {
      const remainingMs = new Date((cooldown as any).endsAt).getTime() - Date.now();
      const remainingMinutes = Math.ceil(remainingMs / (1000 * 60));
      console.log(`   - ${(cooldown as any).action}: ${remainingMinutes} minutes remaining`);
    });

    // Test 5: Test cooldown check function
    console.log('\n5. Testing cooldown check functions...');
    
    // Import the cooldown functions
    const { canPerformEarningAction } = await import('../controllers/cooldownController');
    
    const canTakeQuiz = await canPerformEarningAction(testDeviceId, 'quiz');
    const canWatchAd = await canPerformEarningAction(testDeviceId, 'ad-reward');
    const canCompleteLesson = await canPerformEarningAction(testDeviceId, 'lesson-completion');
    
    console.log(`   Can take quiz: ${canTakeQuiz}`);
    console.log(`   Can watch ad: ${canWatchAd}`);
    console.log(`   Can complete lesson: ${canCompleteLesson}`);

    // Test 6: Test cooldown expiration
    console.log('\n6. Testing cooldown expiration...');
    
    // Create a short cooldown (1 second)
    const shortCooldown = await CooldownPeriod.create({
      deviceId: testDeviceId,
      action: 'test-action',
      durationMinutes: 0.016, // ~1 second
      endsAt: new Date(Date.now() + 1000),
      reason: 'Test cooldown',
      isActive: true
    });
    
    console.log('   Created 1-second test cooldown');
    
    // Wait 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if cooldown is expired
    const canPerformTest = await canPerformEarningAction(testDeviceId, 'test-action');
    console.log(`   After 2 seconds, can perform test action: ${canPerformTest}`);

    // Test 7: Get cooldown statistics
    console.log('\n7. Testing cooldown statistics...');
    const stats = await CooldownPeriod.aggregate([
      {
        $group: {
          _id: '$action',
          totalCooldowns: { $sum: 1 },
          averageDuration: { $avg: '$durationMinutes' },
          totalDuration: { $sum: '$durationMinutes' }
        }
      }
    ]);
    
    console.log('   Cooldown statistics:');
    stats.forEach(stat => {
      console.log(`   - ${stat._id}: ${stat.totalCooldowns} cooldowns, avg ${stat.averageDuration.toFixed(2)} minutes`);
    });

    // Test 8: Clean up test data
    console.log('\n8. Cleaning up test data...');
    await CooldownPeriod.deleteMany({ deviceId: testDeviceId });
    console.log('   Test cooldowns deleted');

    console.log('\n✅ Cooldown system test completed successfully!');

  } catch (error) {
    console.error('Test error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testCooldownSystem();
