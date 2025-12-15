"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoom = exports.getAllRooms = void 0;
const models_1 = require("../models");
const mongodb_1 = require("../utils/mongodb");
const getAllRooms = async (req, res) => {
    try {
        const rooms = await models_1.Room.find({}).sort({ name: 1 });
        const formattedRooms = rooms.map((room) => (0, mongodb_1.formatRoom)(room));
        res.status(200).json({ rooms: formattedRooms });
    }
    catch (error) {
        console.error("Get all rooms error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getAllRooms = getAllRooms;
const createRoom = async (req, res) => {
    const { name, description, isPrivate } = req.body;
    try {
        const existingRoom = await models_1.Room.findOne({ name });
        if (existingRoom) {
            res.status(400).json({ message: "Room already exists" });
            return;
        }
        const newRoom = new models_1.Room({
            name,
            description,
            is_private: isPrivate || false,
        });
        const savedRoom = await newRoom.save();
        const formattedRoom = (0, mongodb_1.formatRoom)(savedRoom);
        res.status(201).json({
            message: "Room created successfully",
            room: formattedRoom,
        });
    }
    catch (error) {
        console.error("Create room error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.createRoom = createRoom;
//# sourceMappingURL=roomController.js.map