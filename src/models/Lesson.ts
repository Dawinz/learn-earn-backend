import mongoose, { Document, Schema } from 'mongoose';

export interface IQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface IAdSlot {
  position: 'mid-lesson' | 'post-quiz' | 'daily-bonus';
  required: boolean;
  coinReward: number;
}

export interface ILesson extends Document {
  title: string;
  summary: string;
  contentMD: string;
  estMinutes: number;
  tags: string[];
  category: string;
  quiz: IQuizQuestion[];
  adSlots: IAdSlot[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuizQuestionSchema = new Schema<IQuizQuestion>({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  explanation: { type: String, required: true }
});

const AdSlotSchema = new Schema<IAdSlot>({
  position: { 
    type: String, 
    enum: ['mid-lesson', 'post-quiz', 'daily-bonus'],
    required: true 
  },
  required: { type: Boolean, default: true },
  coinReward: { type: Number, required: true }
});

const LessonSchema = new Schema<ILesson>({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  contentMD: { type: String, required: true },
  estMinutes: { type: Number, required: true },
  tags: [{ type: String }],
  category: { type: String, required: true },
  quiz: [QuizQuestionSchema],
  adSlots: [AdSlotSchema],
  isPublished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

LessonSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<ILesson>('Lesson', LessonSchema);
