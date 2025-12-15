import mongoose, { Document } from "mongoose";
export interface IRoom extends Document {
    name: string;
    description?: string;
    is_private: boolean;
    created_at: Date;
    updated_at: Date;
}
declare const _default: mongoose.Model<IRoom, {}, {}, {}, mongoose.Document<unknown, {}, IRoom, {}, {}> & IRoom & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Room.d.ts.map