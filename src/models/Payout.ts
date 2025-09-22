import mongoose, { Document, Schema } from 'mongoose';

export interface IPayout extends Document {
  deviceId: string;
  amountUsd: number;
  status: 'pending' | 'paid' | 'rejected';
  reason?: string;
  requestedAt: Date;
  paidAt?: Date;
  txRef?: string;
  adminNotes?: string;
  signature: string;
  nonce: string;
}

const PayoutSchema = new Schema<IPayout>({
  deviceId: { 
    type: String, 
    required: true,
    index: true 
  },
  amountUsd: { 
    type: Number, 
    required: true,
    min: 0 
  },
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'rejected'],
    default: 'pending',
    index: true 
  },
  reason: { 
    type: String 
  },
  requestedAt: { 
    type: Date, 
    default: Date.now,
    index: true 
  },
  paidAt: { 
    type: Date 
  },
  txRef: { 
    type: String 
  },
  adminNotes: { 
    type: String 
  },
  signature: { 
    type: String, 
    required: true 
  },
  nonce: { 
    type: String, 
    required: true 
  }
});

export default mongoose.model<IPayout>('Payout', PayoutSchema);
