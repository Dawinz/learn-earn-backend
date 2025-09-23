"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AdMobConfig_1 = __importDefault(require("../models/AdMobConfig"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function seedAdMobConfig() {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');
        // Android AdMob Configuration
        const androidConfig = {
            platform: 'android',
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
            platform: 'ios',
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
        await AdMobConfig_1.default.deleteMany({});
        console.log('Cleared existing AdMob configurations');
        // Insert new configurations
        await AdMobConfig_1.default.create(androidConfig);
        await AdMobConfig_1.default.create(iosConfig);
        console.log('✅ AdMob configurations seeded successfully');
        console.log('Android App ID:', androidConfig.appId);
        console.log('iOS App ID:', iosConfig.appId);
        console.log('Rewarded Video Reward:', androidConfig.rewards.rewardedVideo, 'coins');
    }
    catch (error) {
        console.error('Error seeding AdMob config:', error);
    }
    finally {
        await mongoose_1.default.disconnect();
        console.log('Disconnected from MongoDB');
    }
}
seedAdMobConfig();
//# sourceMappingURL=seedAdMob.js.map