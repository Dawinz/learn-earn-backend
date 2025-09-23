import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  deviceId: string;
  pubKey: string;
  mmHash?: string;
  numberLockedUntil?: Date;
  createdAt: Date;
  isEmulator: boolean;
  lastActiveAt: Date;
  lastDailyReset?: Date;
  completedLessons: string[];
  dailyResetCount: number;
}

const UserSchema = new Schema<IUser>({
  deviceId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  pubKey: { 
    type: String, 
    required: true 
  },
  mmHash: { 
    type: String, 
    sparse: true 
  },
  numberLockedUntil: { 
    type: Date 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  isEmulator: { 
    type: Boolean, 
    default: false 
  },
  lastActiveAt: { 
    type: Date, 
    default: Date.now 
  },
  lastDailyReset: { 
    type: Date 
  },
  completedLessons: { 
    type: [String], 
    default: [] 
  },
  dailyResetCount: { 
    type: Number, 
    default: 0 
  }
});

export default mongoose.model<IUser>('User', UserSchema);
