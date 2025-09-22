import mongoose, { Document, Schema } from 'mongoose';

export interface IAdMobConfig extends Document {
  platform: 'android' | 'ios';
  appId: string;
  adUnits: {
    rewardedVideo: string;
    interstitial: string;
    banner: string;
    native: string;
  };
  rewards: {
    rewardedVideo: number; // coins
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AdMobConfigSchema = new Schema<IAdMobConfig>({
  platform: { 
    type: String, 
    enum: ['android', 'ios'], 
    required: true,
    unique: true 
  },
  appId: { 
    type: String, 
    required: true 
  },
  adUnits: {
    rewardedVideo: { type: String, required: true },
    interstitial: { type: String, required: true },
    banner: { type: String, required: true },
    native: { type: String, required: true }
  },
  rewards: {
    rewardedVideo: { type: Number, required: true, default: 15 }
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

AdMobConfigSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IAdMobConfig>('AdMobConfig', AdMobConfigSchema);
