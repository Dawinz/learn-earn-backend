import mongoose, { Document, Schema } from 'mongoose';

export interface IEarning extends Document {
  deviceId: string;
  source: 'lesson' | 'quiz' | 'streak' | 'daily-bonus' | 'ad-reward';
  coins: number;
  usd: number;
  lessonId?: string;
  adSlotId?: string;
  createdAt: Date;
}

const EarningSchema = new Schema<IEarning>({
  deviceId: { 
    type: String, 
    required: true,
    index: true 
  },
  source: { 
    type: String, 
    enum: ['lesson', 'quiz', 'streak', 'daily-bonus', 'ad-reward'],
    required: true 
  },
  coins: { 
    type: Number, 
    required: true,
    min: 0 
  },
  usd: { 
    type: Number, 
    required: true,
    min: 0 
  },
  lessonId: { 
    type: String 
  },
  adSlotId: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true 
  }
});

// Compound index for daily earnings queries
EarningSchema.index({ deviceId: 1, createdAt: 1 });

export default mongoose.model<IEarning>('Earning', EarningSchema);
