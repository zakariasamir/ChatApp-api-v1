import { Router, Request, Response } from "express";
import auth from "@/middlewares/authMiddleware";
import { validateCreateMessage } from "@/middlewares/validator";
import { Message } from "@/modules";
import { Types } from "mongoose";

const router = Router({ mergeParams: true });

// Get user messages
router.get(
  "/",
  auth as any,
  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    try {
      const messages = await Message.services.aggregateWithoutPaginate({
        pipeline: [
          {
            $match: {
              $or: [
                { sender_id: new Types.ObjectId(userId) },
                { receiver_id: new Types.ObjectId(userId) },
              ],
            },
          },
          {
            $sort: { created_at: 1 },
          },
        ],
      });

      res.status(200).json({ success: true, data: messages });
    } catch (error) {
      console.error("Get user messages error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Create user message
router.post(
  "/",
  auth as any,
  validateCreateMessage,
  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    const { content } = req.body;
    const senderId = (req as any).user._id;

    try {
      const message = await Message.services.createOne({
        payload: { content, sender_id: senderId, receiver_id: userId },
      });

      res.status(201).json({ success: true, data: message });
    } catch (error) {
      console.error("Create user message error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
