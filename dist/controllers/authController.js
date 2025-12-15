"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.logout = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const models_1 = require("../models");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const mongodb_1 = require("../utils/mongodb");
const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await models_1.User.findOne({
            $or: [{ email }, { username }],
        });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        let profilePicture = "https://res.cloudinary.com/demo/image/upload/v1580125066/samples/people/default-profile.jpg";
        if (req.file) {
            const result = await cloudinary_1.default.uploader.upload(req.file.path, {
                folder: "chat_app/profile_pictures",
                use_filename: true,
            });
            profilePicture = result.secure_url;
            fs_1.default.unlinkSync(req.file.path);
        }
        const newUser = new models_1.User({
            username,
            email,
            password: hashedPassword,
            profile_picture: profilePicture,
        });
        const savedUser = await newUser.save();
        const response = {
            message: "User registered successfully",
            user: (0, mongodb_1.formatUser)(savedUser),
        };
        res.status(201).json(response);
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await models_1.User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        await models_1.User.findByIdAndUpdate(user._id, { is_online: true });
        const token = jsonwebtoken_1.default.sign({ id: (0, mongodb_1.formatUser)(user).id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        const response = {
            message: "Login successful",
            user: (0, mongodb_1.formatUser)(user),
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.login = login;
const logout = async (req, res) => {
    try {
        const user = req.user;
        console.log(user);
        await models_1.User.findByIdAndUpdate(user._id, { is_online: false });
        res.clearCookie("token");
        res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.logout = logout;
const getCurrentUser = async (req, res) => {
    try {
        const authUser = req.user;
        const user = await models_1.User.findById(authUser._id).select("username email profile_picture");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const response = {
            user: (0, mongodb_1.formatUser)(user),
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error("Get current user error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getCurrentUser = getCurrentUser;
//# sourceMappingURL=authController.js.map