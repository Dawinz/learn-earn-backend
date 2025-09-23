import mongoose, { Document } from 'mongoose';
export interface ISettings extends Document {
    minPayoutUsd: number;
    payoutCooldownHours: number;
    maxDailyEarnUsd: number;
    safetyMargin: number;
    eCPM_USD: number;
    impressionsToday: number;
    appPepper: string;
    emulatorPayouts: boolean;
    coinToUsdRate: number;
    lastUpdated: Date;
}
declare const _default: mongoose.Model<ISettings, {}, {}, {}, mongoose.Document<unknown, {}, ISettings, {}, {}> & ISettings & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Settings.d.ts.map