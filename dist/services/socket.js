"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_1 = __importDefault(require("cookie"));
const mongoose_1 = require("mongoose");
const models_1 = require("../models");
const mongodb_1 = require("../utils/mongodb");
exports.default = (io) => {
    const userSockets = new Map();
    io.use(async (socket, next) => {
        try {
            const cookies = cookie_1.default.parse(socket.handshake.headers.cookie || "");
            const token = cookies.token;
            if (!token) {
                return next(new Error("Authentication required"));
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = await models_1.User.findById(decoded.id);
            if (!user) {
                return next(new Error("User not found"));
            }
            const formattedUser = (0, mongodb_1.formatUser)(user);
            socket.user = {
                id: formattedUser.id,
                username: formattedUser.username,
                profile_picture: formattedUser.profile_picture,
            };
            next();
        }
        catch (error) {
            console.error("Socket authentication error:", error);
            next(new Error("Authentication failed"));
        }
    });
    io.on("connection", async (socket) => {
        const user = socket.user;
        console.log(`User connected: ${user.username} (${user.id})`);
        userSockets.set(user.id, socket.id);
        await models_1.User.findByIdAndUpdate(user.id, { is_online: true });
        socket.broadcast.emit("user:online", {
            id: user.id,
            username: user.username,
            profile_picture: user.profile_picture,
        });
        socket.on("room:join", (roomId) => {
            socket.join(`room:${roomId}`);
            console.log(`${user.username} joined room ${roomId}`);
        });
        socket.on("room:leave", (roomId) => {
            socket.leave(`room:${roomId}`);
            console.log(`${user.username} left room ${roomId}`);
        });
        socket.on("message:room", async (data) => {
            try {
                const { roomId, content } = data;
                const newMessage = new models_1.Message({
                    content,
                    sender_id: new mongoose_1.Types.ObjectId(user.id),
                    room_id: new mongoose_1.Types.ObjectId(roomId),
                });
                const savedMessage = await newMessage.save();
                const populatedMessage = await models_1.Message.findById(savedMessage._id).populate("sender_id", "username profile_picture");
                const message = (0, mongodb_1.formatMessage)(populatedMessage);
                io.to(`room:${roomId}`).emit("message:room", message);
            }
            catch (error) {
                console.error("Room message error:", error);
            }
        });
        socket.on("message:private", async (data) => {
            try {
                const { receiverId, content } = data;
                const newMessage = new models_1.Message({
                    content,
                    sender_id: new mongoose_1.Types.ObjectId(user.id),
                    receiver_id: new mongoose_1.Types.ObjectId(receiverId),
                });
                const savedMessage = await newMessage.save();
                const populatedMessage = await models_1.Message.findById(savedMessage._id).populate("sender_id", "username profile_picture");
                const message = (0, mongodb_1.formatMessage)(populatedMessage);
                const receiverSocketId = userSockets.get(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("message:private", message);
                }
                socket.emit("message:private", message);
            }
            catch (error) {
                console.error("Private message error:", error);
            }
        });
        socket.on("typing:start", (data) => {
            if (data.roomId) {
                socket.to(`room:${data.roomId}`).emit("typing:start", {
                    user: user,
                    roomId: data.roomId,
                });
            }
            else if (data.receiverId) {
                const receiverSocketId = userSockets.get(data.receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("typing:start", {
                        user: user,
                    });
                }
            }
        });
        socket.on("typing:stop", (data) => {
            if (data.roomId) {
                socket.to(`room:${data.roomId}`).emit("typing:stop", {
                    user: user,
                    roomId: data.roomId,
                });
            }
            else if (data.receiverId) {
                const receiverSocketId = userSockets.get(data.receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("typing:stop", {
                        user: user,
                    });
                }
            }
        });
        socket.on("disconnect", async () => {
            console.log(`User disconnected: ${user.username} (${user.id})`);
            userSockets.delete(user.id);
            setTimeout(async () => {
                if (!userSockets.has(user.id)) {
                    await models_1.User.findByIdAndUpdate(user.id, { is_online: false });
                    socket.broadcast.emit("user:offline", {
                        id: user.id,
                    });
                }
            }, 5000);
        });
    });
};
//# sourceMappingURL=socket.js.map