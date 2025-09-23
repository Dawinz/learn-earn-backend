import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    deviceId: string;
    pubKey: string;
    mmHash?: string;
    numberLockedUntil?: Date;
    createdAt: Date;
    isEmulator: boolean;
    lastActiveAt: Date;
    lastDailyReset?: Date;
    completedLessons: string[];
    dailyResetCount: number;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=User.d.ts.map