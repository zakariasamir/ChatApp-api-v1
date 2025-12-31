import { Router, Request, Response, NextFunction } from "express";
import auth from "@/middlewares/authMiddleware";
import RoomUser from "@/modules/room-user";

const router = Router({ mergeParams: true });

interface CreateRoomUserRequest {
  user_id: string;
  role: string;
  is_muted: boolean;
  is_banned: boolean;
  last_read_message_id: string;
}

// GET /api/v1/rooms/[roomId]/users
router.get(
  "/",
  auth as any,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { roomId } = req.params;
      const roomUsers = await RoomUser.services.fetchAll({
        query: { _id: roomId },
        selection: [
          "user",
          "role",
          "is_muted",
          "is_banned",
          "last_read_message_id",
        ],
      });

      res.status(200).json(roomUsers);
    } catch (error) {
      console.error("Get room error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// PUT /api/v1/rooms/[roomId]/users
router.post(
  "/",
  auth as any,
  async (req: Request, res: Response): Promise<void> => {
    const { roomId } = req.params as { roomId: string };
    const { user, role, is_muted, is_banned } = req.body;

    try {
      // Check if room already exists
      const existingRoomUser = await RoomUser.services.fetchOne({
        query: { roomId: roomId, userId: user },
        selection: [
          "user",
          "role",
          "is_muted",
          "is_banned",
          "last_read_message_id",
        ],
      });

      if (existingRoomUser) {
        res.status(400).json({ message: "Room user already exists" });
        return;
      }

      const newRoomUser = await RoomUser.services.createOne({
        payload: { room: roomId, user, role, is_muted, is_banned },
      });

      res.status(200).json({
        message: "Room user created successfully",
        roomUser: newRoomUser,
      });
    } catch (error) {
      console.error("Create room user error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
