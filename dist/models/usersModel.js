"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModel = void 0;
const schemas_1 = require("../schemas");
const mongodb_1 = require("../utils/mongodb");
class UsersModel {
    static async create(userData) {
        const newUser = new schemas_1.User(userData);
        const savedUser = await newUser.save();
        return (0, mongodb_1.getIdString)(savedUser);
    }
    static async findById(id) {
        const user = await schemas_1.User.findById(id);
        if (!user)
            return undefined;
        return (0, mongodb_1.formatUser)(user);
    }
    static async findByEmail(email) {
        const user = await schemas_1.User.findOne({ email });
        if (!user)
            return undefined;
        return (0, mongodb_1.formatUser)(user);
    }
    static async findByUsername(username) {
        const user = await schemas_1.User.findOne({ username });
        if (!user)
            return undefined;
        return (0, mongodb_1.formatUser)(user);
    }
    static async findByEmailOrUsername(email, username) {
        const user = await schemas_1.User.findOne({
            $or: [{ email }, { username }],
        });
        if (!user)
            return undefined;
        return (0, mongodb_1.formatUser)(user);
    }
    static async update(id, userData) {
        const updatedUser = await schemas_1.User.findByIdAndUpdate(id, userData, { new: true });
        if (!updatedUser)
            return undefined;
        return (0, mongodb_1.formatUser)(updatedUser);
    }
    static async updateOnlineStatus(id, isOnline) {
        await schemas_1.User.findByIdAndUpdate(id, { is_online: isOnline });
    }
    static async getAll() {
        const users = await schemas_1.User.find({});
        return users.map(user => (0, mongodb_1.formatUser)(user));
    }
    static async getOnlineUsers() {
        const users = await schemas_1.User.find({ is_online: true });
        return users.map(user => (0, mongodb_1.formatUser)(user));
    }
    static async delete(id) {
        await schemas_1.User.findByIdAndDelete(id);
    }
}
exports.UsersModel = UsersModel;
//# sourceMappingURL=usersModel.js.map