"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesModel = void 0;
const mongoose_1 = require("mongoose");
const schemas_1 = require("../schemas");
const mongodb_1 = require("../utils/mongodb");
class MessagesModel {
    static async create(messageData) {
        const newMessage = new schemas_1.Message(messageData);
        const savedMessage = await newMessage.save();
        return (0, mongodb_1.getIdString)(savedMessage);
    }
    static async findById(id) {
        const message = await schemas_1.Message.findById(id)
            .populate("sender_id", "username profile_picture");
        if (!message)
            return undefined;
        return (0, mongodb_1.formatMessage)(message);
    }
    static async findByRoomId(roomId) {
        const messages = await schemas_1.Message.find({ room_id: new mongoose_1.Types.ObjectId(roomId) })
            .populate("sender_id", "username profile_picture")
            .sort({ created_at: 1 });
        return messages.map(message => (0, mongodb_1.formatMessage)(message));
    }
    static async findPrivateMessages(userId1, userId2) {
        const messages = await schemas_1.Message.find({
            room_id: null,
            $or: [
                { sender_id: new mongoose_1.Types.ObjectId(userId1), receiver_id: new mongoose_1.Types.ObjectId(userId2) },
                { sender_id: new mongoose_1.Types.ObjectId(userId2), receiver_id: new mongoose_1.Types.ObjectId(userId1) }
            ]
        })
            .populate("sender_id", "username profile_picture")
            .sort({ created_at: 1 });
        return messages.map(message => (0, mongodb_1.formatMessage)(message));
    }
    static async markAsRead(senderId, receiverId) {
        await schemas_1.Message.updateMany({
            room_id: null,
            sender_id: new mongoose_1.Types.ObjectId(senderId),
            receiver_id: new mongoose_1.Types.ObjectId(receiverId),
            is_read: false,
        }, { is_read: true });
    }
    static async update(id, messageData) {
        const updatedMessage = await schemas_1.Message.findByIdAndUpdate(id, messageData, { new: true })
            .populate("sender_id", "username profile_picture");
        if (!updatedMessage)
            return undefined;
        return (0, mongodb_1.formatMessage)(updatedMessage);
    }
    static async delete(id) {
        await schemas_1.Message.findByIdAndDelete(id);
    }
    static async deleteByRoomId(roomId) {
        await schemas_1.Message.deleteMany({ room_id: new mongoose_1.Types.ObjectId(roomId) });
    }
    static async deleteByUserId(userId) {
        await schemas_1.Message.deleteMany({
            $or: [
                { sender_id: new mongoose_1.Types.ObjectId(userId) },
                { receiver_id: new mongoose_1.Types.ObjectId(userId) }
            ]
        });
    }
}
exports.MessagesModel = MessagesModel;
//# sourceMappingURL=messagesModel.js.map