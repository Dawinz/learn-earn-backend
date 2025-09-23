import mongoose, { Document } from 'mongoose';
export interface IAdMobConfig extends Document {
    platform: 'android' | 'ios';
    appId: string;
    adUnits: {
        rewardedVideo: string;
        interstitial: string;
        banner: string;
        native: string;
    };
    rewards: {
        rewardedVideo: number;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IAdMobConfig, {}, {}, {}, mongoose.Document<unknown, {}, IAdMobConfig, {}, {}> & IAdMobConfig & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=AdMobConfig.d.ts.map