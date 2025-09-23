import mongoose, { Document } from 'mongoose';
export interface IEarning extends Document {
    deviceId: string;
    source: 'lesson' | 'quiz' | 'streak' | 'daily-bonus' | 'ad-reward';
    coins: number;
    usd: number;
    lessonId?: string;
    adSlotId?: string;
    createdAt: Date;
}
declare const _default: mongoose.Model<IEarning, {}, {}, {}, mongoose.Document<unknown, {}, IEarning, {}, {}> & IEarning & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Earning.d.ts.map