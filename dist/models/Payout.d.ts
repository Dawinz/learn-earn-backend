import mongoose, { Document } from 'mongoose';
export interface IPayout extends Document {
    deviceId: string;
    amountUsd: number;
    status: 'pending' | 'paid' | 'rejected';
    reason?: string;
    requestedAt: Date;
    paidAt?: Date;
    txRef?: string;
    adminNotes?: string;
    signature: string;
    nonce: string;
}
declare const _default: mongoose.Model<IPayout, {}, {}, {}, mongoose.Document<unknown, {}, IPayout, {}, {}> & IPayout & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Payout.d.ts.map