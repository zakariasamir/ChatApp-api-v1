import { Types } from "mongoose";
export declare const toObjectId: (id: string | Types.ObjectId) => Types.ObjectId;
export declare const getIdString: (doc: any) => string;
export declare const formatUser: (user: any) => {
    id: string;
    username: any;
    email: any;
    password: any;
    profile_picture: any;
    is_online: any;
    created_at: any;
    updated_at: any;
};
export declare const formatRoom: (room: any) => {
    id: string;
    name: any;
    description: any;
    is_private: any;
    created_at: any;
    updated_at: any;
};
export declare const formatMessage: (message: any) => {
    id: string;
    content: any;
    sender_id: any;
    room_id: any;
    receiver_id: any;
    is_read: any;
    created_at: any;
    updated_at: any;
    sender_name: any;
    sender_profile_picture: any;
};
//# sourceMappingURL=mongodb.d.ts.map