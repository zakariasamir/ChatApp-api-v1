"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsModel = void 0;
const schemas_1 = require("../schemas");
const mongodb_1 = require("../utils/mongodb");
class RoomsModel {
    static async create(roomData) {
        const newRoom = new schemas_1.Room(roomData);
        const savedRoom = await newRoom.save();
        return (0, mongodb_1.getIdString)(savedRoom);
    }
    static async findById(id) {
        const room = await schemas_1.Room.findById(id);
        if (!room)
            return undefined;
        return (0, mongodb_1.formatRoom)(room);
    }
    static async findByName(name) {
        const room = await schemas_1.Room.findOne({ name });
        if (!room)
            return undefined;
        return (0, mongodb_1.formatRoom)(room);
    }
    static async getAll() {
        const rooms = await schemas_1.Room.find({}).sort({ name: 1 });
        return rooms.map(room => (0, mongodb_1.formatRoom)(room));
    }
    static async update(id, roomData) {
        const updatedRoom = await schemas_1.Room.findByIdAndUpdate(id, roomData, { new: true });
        if (!updatedRoom)
            return undefined;
        return (0, mongodb_1.formatRoom)(updatedRoom);
    }
    static async delete(id) {
        await schemas_1.Room.findByIdAndDelete(id);
    }
}
exports.RoomsModel = RoomsModel;
//# sourceMappingURL=roomsModel.js.map