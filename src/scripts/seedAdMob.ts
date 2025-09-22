import mongoose from 'mongoose';
import AdMobConfig from '../models/AdMobConfig';
import dotenv from 'dotenv';

dotenv.config();

async function seedAdMobConfig() {
  try {
    await mongoose.connect(process.env.MONGO_URL!);
    console.log('Connected to MongoDB');

    // Android AdMob Configuration
    const androidConfig = {
      platform: 'android' as const,
      appId: 'ca-app-pub-6181092189054832~8209731658',
      adUnits: {
        rewardedVideo: 'ca-app-pub-6181092189054832/8716998116',
        interstitial: 'ca-app-pub-6181092189054832/5074116633',
        banner: 'ca-app-pub-6181092189054832/8525426424',
        native: 'ca-app-pub-6181092189054832/4586181410'
      },
      rewards: {
        rewardedVideo: 15
      },
      isActive: true
    };

    // iOS AdMob Configuration
    const iosConfig = {
      platform: 'ios' as const,
      appId: 'ca-app-pub-6181092189054832~3807452213',
      adUnits: {
        rewardedVideo: 'ca-app-pub-6181092189054832/5470504786',
        interstitial: 'ca-app-pub-6181092189054832/4471481405',
        banner: 'ca-app-pub-6181092189054832/1900308326',
        native: 'ca-app-pub-6181092189054832/2360323384'
      },
      rewards: {
        rewardedVideo: 15
      },
      isActive: true
    };

    // Clear existing configurations
    await AdMobConfig.deleteMany({});
    console.log('Cleared existing AdMob configurations');

    // Insert new configurations
    await AdMobConfig.create(androidConfig);
    await AdMobConfig.create(iosConfig);
    
    console.log('✅ AdMob configurations seeded successfully');
    console.log('Android App ID:', androidConfig.appId);
    console.log('iOS App ID:', iosConfig.appId);
    console.log('Rewarded Video Reward:', androidConfig.rewards.rewardedVideo, 'coins');

  } catch (error) {
    console.error('Error seeding AdMob config:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedAdMobConfig();
