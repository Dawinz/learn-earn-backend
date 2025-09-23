import mongoose, { Document } from 'mongoose';
export interface IAuthUser extends Document {
    email: string;
    password: string;
    name: string;
    phoneNumber?: string;
    isEmailVerified: boolean;
    createdAt: Date;
    lastLoginAt?: Date;
    profileImageUrl?: string;
}
declare const _default: mongoose.Model<IAuthUser, {}, {}, {}, mongoose.Document<unknown, {}, IAuthUser, {}, {}> & IAuthUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=AuthUser.d.ts.map