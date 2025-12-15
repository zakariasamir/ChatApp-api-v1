import { Request, Response } from "express";

import { Room } from "../modules";
import { formatRoom } from "../utils/mongodb";

interface CreateRoomRequest {
  name: string;
  description?: string;
  isPrivate?: boolean;
}

// Get all rooms
export const getAllRooms = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const rooms = await Room.find({}).sort({ name: 1 });

    const formattedRooms = rooms.map((room) => formatRoom(room));

    res.status(200).json({ rooms: formattedRooms });
  } catch (error) {
    console.error("Get all rooms error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create room
export const createRoom = async (
  req: Request<{}, {}, CreateRoomRequest>,
  res: Response
): Promise<void> => {
  const { name, description, isPrivate } = req.body;

  try {
    // Check if room already exists
    const existingRoom = await Room.findOne({ name });

    if (existingRoom) {
      res.status(400).json({ message: "Room already exists" });
      return;
    }

    const newRoom = new Room({
      name,
      description,
      is_private: isPrivate || false,
    });

    const savedRoom = await newRoom.save();

    const formattedRoom = formatRoom(savedRoom);

    res.status(201).json({
      message: "Room created successfully",
      room: formattedRoom,
    });
  } catch (error) {
    console.error("Create room error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
