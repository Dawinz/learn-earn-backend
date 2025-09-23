import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<ICooldownPeriod, {}, {}, {}, mongoose.Document<unknown, {}, ICooldownPeriod, {}, {}> & ICooldownPeriod & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=CooldownPeriod.d.ts.map