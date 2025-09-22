import mongoose, { Document, Schema } from 'mongoose';

export interface IAudit extends Document {
  deviceId: string;
  action: string;
  detail: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

const AuditSchema = new Schema<IAudit>({
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
  detail: { 
    type: String, 
    required: true 
  },
  ipAddress: { 
    type: String 
  },
  userAgent: { 
    type: String 
  },
  timestamp: { 
    type: Date, 
    default: Date.now,
    index: true 
  }
});

export default mongoose.model<IAudit>('Audit', AuditSchema);
