import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  minPayoutUsd: number;
  payoutCooldownHours: number;
  maxDailyEarnUsd: number;
  safetyMargin: number;
  eCPM_USD: number;
  impressionsToday: number;
  appPepper: string;
  emulatorPayouts: boolean;
  coinToUsdRate: number;
  lastUpdated: Date;
}

const SettingsSchema = new Schema<ISettings>({
  minPayoutUsd: { 
    type: Number, 
    required: true,
    default: 5 
  },
  payoutCooldownHours: { 
    type: Number, 
    required: true,
    default: 48 
  },
  maxDailyEarnUsd: { 
    type: Number, 
    required: true,
    default: 0.5 
  },
  safetyMargin: { 
    type: Number, 
    required: true,
    default: 0.6 
  },
  eCPM_USD: { 
    type: Number, 
    required: true,
    default: 1.5 
  },
  impressionsToday: { 
    type: Number, 
    required: true,
    default: 0 
  },
  appPepper: { 
    type: String, 
    required: true 
  },
  emulatorPayouts: { 
    type: Boolean, 
    required: true,
    default: false 
  },
  coinToUsdRate: { 
    type: Number, 
    required: true,
    default: 0.001 
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }
});

// Ensure only one settings document exists
SettingsSchema.index({}, { unique: true });

export default mongoose.model<ISettings>('Settings', SettingsSchema);
