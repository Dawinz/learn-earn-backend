import mongoose, { Document } from 'mongoose';
export interface IAudit extends Document {
    deviceId: string;
    action: string;
    detail: string;
    ipAddress?: string;
    userAgent?: string;
    timestamp: Date;
}
declare const _default: mongoose.Model<IAudit, {}, {}, {}, mongoose.Document<unknown, {}, IAudit, {}, {}> & IAudit & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Audit.d.ts.map