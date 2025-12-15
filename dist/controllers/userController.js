"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfilePicture = exports.getOnlineUsers = exports.getAllUsers = void 0;
const fs_1 = __importDefault(require("fs"));
const models_1 = require("../models");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const mongodb_1 = require("../utils/mongodb");
const getAllUsers = async (req, res) => {
    try {
        const users = await models_1.User.find({})
            .select("username email profile_picture is_online")
            .sort({ username: 1 });
        const formattedUsers = users.map((user) => (0, mongodb_1.formatUser)(user));
        res.status(200).json({ users: formattedUsers });
    }
    catch (error) {
        console.error("Get all users error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getAllUsers = getAllUsers;
const getOnlineUsers = async (req, res) => {
    try {
        const users = await models_1.User.find({ is_online: true })
            .select("username profile_picture")
            .sort({ username: 1 });
        const formattedUsers = users.map((user) => (0, mongodb_1.formatUser)(user));
        res.status(200).json({ users: formattedUsers });
    }
    catch (error) {
        console.error("Get online users error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getOnlineUsers = getOnlineUsers;
const updateProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }
        const result = await cloudinary_1.default.uploader.upload(req.file.path, {
            folder: "chat_app/profile_pictures",
            use_filename: true,
        });
        const user = req.user;
        await models_1.User.findByIdAndUpdate(user._id, {
            profile_picture: result.secure_url,
        });
        fs_1.default.unlinkSync(req.file.path);
        res.status(200).json({
            message: "Profile picture updated successfully",
            profile_picture: result.secure_url,
        });
    }
    catch (error) {
        console.error("Update profile picture error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.updateProfilePicture = updateProfilePicture;
//# sourceMappingURL=userController.js.map