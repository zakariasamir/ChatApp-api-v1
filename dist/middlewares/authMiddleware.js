"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const modules_1 = require("../modules");
const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await modules_1.User.services.fetchById({
            id: decoded.id,
            selection: ["username", "email", "profile_picture", "is_online"],
        });
        if (!user) {
            res.status(401).json({ message: "User not found" });
            return;
        }
        req.user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            password: user.password,
            profile_picture: user.profile_picture,
            is_online: user.is_online,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };
        next();
    }
    catch (error) {
        console.error("Auth middleware error:", error);
        res.status(401).json({ message: "Authentication failed" });
    }
};
exports.default = auth;
//# sourceMappingURL=authMiddleware.js.map