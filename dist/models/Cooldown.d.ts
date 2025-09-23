import mongoose, { Document } from 'mongoose';
export interface ICooldown extends Document {
    deviceId: string;
    nextPayoutAt: Date;
    reason: 'cooldown' | 'daily_cap' | 'budget_exceeded';
    createdAt: Date;
}
declare const _default: mongoose.Model<ICooldown, {}, {}, {}, mongoose.Document<unknown, {}, ICooldown, {}, {}> & ICooldown & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Cooldown.d.ts.map