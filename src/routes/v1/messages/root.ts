import express from "express";
import auth from "../../../middlewares/authMiddleware";
import { validateCreateMessage } from "../../../middlewares/validator";

const router = express.Router();

// Get room messages
router.get("/room/:roomId", auth as any, messageController.getRoomMessages);

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
