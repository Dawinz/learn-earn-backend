import mongoose, { Document, Schema } from 'mongoose';

export interface IAuthUser extends Document {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
  isEmailVerified: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
  profileImageUrl?: string;
}

const AuthUserSchema = new Schema<IAuthUser>({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  name: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 2
  },
  phoneNumber: { 
    type: String,
    trim: true
  },
  isEmailVerified: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  lastLoginAt: { 
    type: Date 
  },
  profileImageUrl: { 
    type: String 
  }
});

// Index for faster queries
AuthUserSchema.index({ email: 1 });
AuthUserSchema.index({ createdAt: -1 });

export default mongoose.model<IAuthUser>('AuthUser', AuthUserSchema);
