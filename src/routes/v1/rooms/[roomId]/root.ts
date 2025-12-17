import { Router, Request, Response, NextFunction } from "express";
import auth from "@/middlewares/authMiddleware";
import { validateCreateRoom } from "@/middlewares/validator";
import { Room } from "@/modules";

const router = Router();

interface CreateRoomRequest {
  name: string;
  description?: string;
  isPrivate?: boolean;
}

// GET /api/v1/rooms/[roomId]
router.get(
  "/",
  auth as any,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { roomId } = req.params;
      const room = await Room.services.fetchById({
        query: { _id: roomId },
        selection: ["name", "description", "is_private"],
      });

      if (!room) {
        res.status(404).json({ message: "Room not found" });
        return;
      }

      res.status(200).json(room);
    } catch (error) {
      console.error("Get room error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// PUT /api/v1/rooms/[roomId]
router.put(
  "/",
  auth as any,
  validateCreateRoom,
  async (
    req: Request<{}, {}, CreateRoomRequest>,
    res: Response
  ): Promise<void> => {
    const { roomId } = req.params as { roomId: string };
    const { name, description, isPrivate } = req.body;

    try {
      // Check if room already exists
      const existingRoom = await Room.services.fetchOne({
        query: { _id: roomId },
        selection: ["name", "description", "is_private"],
      });

      if (existingRoom) {
        res.status(400).json({ message: "Room already exists" });
        return;
      }

      const updatedRoom = await Room.services.updateOne({
        query: { _id: roomId },
        payload: { name, description, is_private: isPrivate || false },
      });

      res.status(200).json({
        message: "Room updated successfully",
        room: updatedRoom,
      });
    } catch (error) {
      console.error("Update room error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
