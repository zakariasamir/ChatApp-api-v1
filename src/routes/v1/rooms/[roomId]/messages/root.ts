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
      const messages = await Message.find({
        room_id: new Types.ObjectId(roomId),
      })
        .populate("sender_id", "username profile_picture")
        .sort({ created_at: 1 });

      const formattedMessages = messages.map((message) =>
        formatMessage(message)
      );

      res.status(200).json({ messages: formattedMessages });
    } catch (error) {
      console.error("Get room messages error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get private messages
router.get(
  "/private/:userId",
  auth as any,
  messageController.getPrivateMessages
);

// Create room message
router.post(
  "/room/:roomId",
  auth as any,
  validateCreateMessage,
  messageController.createRoomMessage
);

// Create private message
router.post(
  "/private/:userId",
  auth as any,
  validateCreateMessage,
  messageController.createPrivateMessage
);

export default router;
