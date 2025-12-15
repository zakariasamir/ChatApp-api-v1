"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMessage = exports.formatRoom = exports.formatUser = exports.getIdString = exports.toObjectId = void 0;
const mongoose_1 = require("mongoose");
const toObjectId = (id) => {
    if (typeof id === "string") {
        return new mongoose_1.Types.ObjectId(id);
    }
    return id;
};
exports.toObjectId = toObjectId;
const getIdString = (doc) => {
    return doc._id.toString();
};
exports.getIdString = getIdString;
const formatUser = (user) => ({
    id: (0, exports.getIdString)(user),
    username: user.username,
    email: user.email,
    password: user.password,
    profile_picture: user.profile_picture,
    is_online: user.is_online,
    created_at: user.created_at,
    updated_at: user.updated_at,
});
exports.formatUser = formatUser;
const formatRoom = (room) => ({
    id: (0, exports.getIdString)(room),
    name: room.name,
    description: room.description,
    is_private: room.is_private,
    created_at: room.created_at,
    updated_at: room.updated_at,
});
exports.formatRoom = formatRoom;
const formatMessage = (message) => ({
    id: (0, exports.getIdString)(message),
    content: message.content,
    sender_id: message.sender_id,
    room_id: message.room_id?.toString(),
    receiver_id: message.receiver_id?.toString(),
    is_read: message.is_read,
    created_at: message.created_at,
    updated_at: message.updated_at,
    sender_name: message.sender_id?.username,
    sender_profile_picture: message.sender_id?.profile_picture,
});
exports.formatMessage = formatMessage;
//# sourceMappingURL=mongodb.js.map