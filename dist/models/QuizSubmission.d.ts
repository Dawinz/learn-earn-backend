import mongoose, { Document } from 'mongoose';
export interface IQuizSubmission extends Document {
    deviceId: string;
    lessonId: string;
    answers: number[];
    score: number;
    passed: boolean;
    timeSpent: number;
    coinsEarned: number;
    usdEarned: number;
    createdAt: Date;
}
declare const _default: mongoose.Model<IQuizSubmission, {}, {}, {}, mongoose.Document<unknown, {}, IQuizSubmission, {}, {}> & IQuizSubmission & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=QuizSubmission.d.ts.map