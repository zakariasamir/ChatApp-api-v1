import { Router, Request, Response } from "express";
import auth from "../../../../../middlewares/authMiddleware";
import { validateCreateMessage } from "../../../../../middlewares/validator";
import { Message } from "@/modules";
import { formatMessage } from "@/utils/mongodb";
import { Types } from "mongoose";

const router = Router();

// Get room messages
router.get(
  "/",
  auth as any,
  async (req: Request, res: Response): Promise<void> => {
    const { roomId } = req.params;

    try {
      const messages = await Message.services.fetchAll({
        query: {
          room_id: new Types.ObjectId(roomId),
          selection: ["content", "sender_id", "created_at"],
          sort: { created_at: 1 },
          populate: {
            path: "sender_id",
            selection: ["username", "profile_picture"],
          },
        },
      });

      res.status(200).json({ success: true, data: messages });
    } catch (error) {
      console.error("Get room messages error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Create room message
router.post(
  "/",
  auth as any,
  validateCreateMessage,
  async (req: Request, res: Response): Promise<void> => {
    const { roomId } = req.params;
    const { content } = req.body;
    const senderId = req.user._id;
    const message = await Message.services.createOne({
      payload: { content, sender_id: senderId, room_id: roomId },
    });
  }
);

export default router;
