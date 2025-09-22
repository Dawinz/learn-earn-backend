import mongoose, { Document, Schema } from 'mongoose';

export interface ICooldown extends Document {
  deviceId: string;
  nextPayoutAt: Date;
  reason: 'cooldown' | 'daily_cap' | 'budget_exceeded';
  createdAt: Date;
}

const CooldownSchema = new Schema<ICooldown>({
  deviceId: { 
    type: String, 
    required: true,
    unique: true,
    index: true 
  },
  nextPayoutAt: { 
    type: Date, 
    required: true 
  },
  reason: { 
    type: String, 
    enum: ['cooldown', 'daily_cap', 'budget_exceeded'],
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model<ICooldown>('Cooldown', CooldownSchema);
