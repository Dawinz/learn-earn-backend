import mongoose, { Document, Schema } from 'mongoose';

export interface IQuizSubmission extends Document {
  deviceId: string;
  lessonId: string;
  answers: number[]; // Array of selected answer indices
  score: number; // Percentage score (0-100)
  passed: boolean; // Whether user passed (>= 70%)
  timeSpent: number; // Time in seconds
  coinsEarned: number;
  usdEarned: number;
  createdAt: Date;
}

const QuizSubmissionSchema = new Schema<IQuizSubmission>({
  deviceId: { 
    type: String, 
    required: true,
    index: true 
  },
  lessonId: { 
    type: String, 
    required: true,
    index: true 
  },
  answers: [{ 
    type: Number, 
    required: true 
  }],
  score: { 
    type: Number, 
    required: true,
    min: 0,
    max: 100
  },
  passed: { 
    type: Boolean, 
    required: true 
  },
  timeSpent: { 
    type: Number, 
    required: true,
    min: 0
  },
  coinsEarned: { 
    type: Number, 
    required: true,
    min: 0
  },
  usdEarned: { 
    type: Number, 
    required: true,
    min: 0
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true 
  }
});

// Compound index for user lesson queries
QuizSubmissionSchema.index({ deviceId: 1, lessonId: 1 });
QuizSubmissionSchema.index({ deviceId: 1, createdAt: -1 });

export default mongoose.model<IQuizSubmission>('QuizSubmission', QuizSubmissionSchema);
