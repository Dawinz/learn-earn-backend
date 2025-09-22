import mongoose, { Document, Schema } from 'mongoose';

export interface ICooldownPeriod extends Document {
  deviceId: string;
  action: string;
  durationMinutes: number;
  endsAt: Date;
  reason: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CooldownPeriodSchema = new Schema<ICooldownPeriod>({
  deviceId: { 
    type: String, 
    required: true,
    index: true 
  },
  action: { 
    type: String, 
    required: true,
    index: true 
  },
  durationMinutes: { 
    type: Number, 
    required: true,
    min: 0
  },
  endsAt: { 
    type: Date, 
    required: true,
    index: true 
  },
  reason: { 
    type: String, 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true,
    index: true 
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

// Compound index for efficient queries
CooldownPeriodSchema.index({ deviceId: 1, action: 1, isActive: 1 });
CooldownPeriodSchema.index({ deviceId: 1, isActive: 1, endsAt: 1 });

CooldownPeriodSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<ICooldownPeriod>('CooldownPeriod', CooldownPeriodSchema);
