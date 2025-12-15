"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPrivateMessage = exports.createRoomMessage = exports.getPrivateMessages = exports.getRoomMessages = void 0;
const mongoose_1 = require("mongoose");
const models_1 = require("../models");
const mongodb_1 = require("../utils/mongodb");
const getRoomMessages = async (req, res) => {
    const { roomId } = req.params;
    try {
        const messages = await models_1.Message.find({ room_id: new mongoose_1.Types.ObjectId(roomId) })
            .populate("sender_id", "username profile_picture")
            .sort({ created_at: 1 });
        const formattedMessages = messages.map((message) => (0, mongodb_1.formatMessage)(message));
        res.status(200).json({ messages: formattedMessages });
    }
    catch (error) {
        console.error("Get room messages error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getRoomMessages = getRoomMessages;
const getPrivateMessages = async (req, res) => {
    const { userId } = req.params;
    const currentUserId = req.user.id;
    try {
        const messages = await models_1.Message.find({
            room_id: null,
            $or: [
                {
                    sender_id: new mongoose_1.Types.ObjectId(currentUserId),
                    receiver_id: new mongoose_1.Types.ObjectId(userId),
                },
                {
                    sender_id: new mongoose_1.Types.ObjectId(userId),
                    receiver_id: new mongoose_1.Types.ObjectId(currentUserId),
                },
            ],
        })
            .populate("sender_id", "username profile_picture")
            .sort({ created_at: 1 });
        await models_1.Message.updateMany({
            room_id: null,
            sender_id: new mongoose_1.Types.ObjectId(userId),
            receiver_id: new mongoose_1.Types.ObjectId(currentUserId),
            is_read: false,
        }, { is_read: true });
        const formattedMessages = messages.map((message) => (0, mongodb_1.formatMessage)(message));
        res.status(200).json({ messages: formattedMessages });
    }
    catch (error) {
        console.error("Get private messages error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getPrivateMessages = getPrivateMessages;
const createRoomMessage = async (req, res) => {
    const { roomId } = req.params;
    const { content } = req.body;
    const senderId = req.user.id;
    try {
        const newMessage = new models_1.Message({
            content,
            sender_id: new mongoose_1.Types.ObjectId(senderId),
            room_id: new mongoose_1.Types.ObjectId(roomId),
        });
        const savedMessage = await newMessage.save();
        const populatedMessage = await models_1.Message.findById(savedMessage._id).populate("sender_id", "username profile_picture");
        const formattedMessage = (0, mongodb_1.formatMessage)(populatedMessage);
        res.status(201).json({
            message: "Message sent successfully",
            data: formattedMessage,
        });
    }
    catch (error) {
        console.error("Create room message error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.createRoomMessage = createRoomMessage;
const createPrivateMessage = async (req, res) => {
    const { userId } = req.params;
    const { content } = req.body;
    const senderId = req.user.id;
    try {
        const newMessage = new models_1.Message({
            content,
            sender_id: new mongoose_1.Types.ObjectId(senderId),
            receiver_id: new mongoose_1.Types.ObjectId(userId),
        });
        const savedMessage = await newMessage.save();
        const populatedMessage = await models_1.Message.findById(savedMessage._id).populate("sender_id", "username profile_picture");
        const formattedMessage = (0, mongodb_1.formatMessage)(populatedMessage);
        res.status(201).json({
            message: "Private message sent successfully",
            data: formattedMessage,
        });
    }
    catch (error) {
        console.error("Create private message error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.createPrivateMessage = createPrivateMessage;
//# sourceMappingURL=messageController.js.map