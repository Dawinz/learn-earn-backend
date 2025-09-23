import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<ILesson, {}, {}, {}, mongoose.Document<unknown, {}, ILesson, {}, {}> & ILesson & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Lesson.d.ts.map