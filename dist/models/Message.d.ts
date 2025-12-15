import mongoose, { Document, Types } from "mongoose";
export interface IMessage extends Document {
    content: string;
    sender_id: Types.ObjectId;
    receiver_id?: Types.ObjectId;
    room_id?: Types.ObjectId;
    is_read: boolean;
    created_at: Date;
    updated_at: Date;
}
declare const _default: mongoose.Model<IMessage, {}, {}, {}, mongoose.Document<unknown, {}, IMessage, {}, {}> & IMessage & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Message.d.ts.map