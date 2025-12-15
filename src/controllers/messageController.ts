import { Request, Response } from "express";
import { Types } from "mongoose";

import { Message, User } from "../modules";
import { AuthenticatedRequest } from "../types";
import { formatMessage } from "../utils/mongodb";

interface CreateMessageRequest {
  content: string;
}

// Get room messages
export const getRoomMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { roomId } = req.params;

  try {
    const messages = await Message.find({ room_id: new Types.ObjectId(roomId) })
      .populate("sender_id", "username profile_picture")
      .sort({ created_at: 1 });

    const formattedMessages = messages.map((message) => formatMessage(message));

    res.status(200).json({ messages: formattedMessages });
  } catch (error) {
    console.error("Get room messages error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get private messages
export const getPrivateMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params as { userId: string };
  const currentUserId = (req as any).user.id;

  try {
    const messages = await Message.find({
      room_id: null,
      $or: [
        {
          sender_id: new Types.ObjectId(currentUserId),
          receiver_id: new Types.ObjectId(userId),
        },
        {
          sender_id: new Types.ObjectId(userId),
          receiver_id: new Types.ObjectId(currentUserId),
        },
      ],
    })
      .populate("sender_id", "username profile_picture")
      .sort({ created_at: 1 });

    // Mark messages as read
    await Message.updateMany(
      {
        room_id: null,
        sender_id: new Types.ObjectId(userId),
        receiver_id: new Types.ObjectId(currentUserId),
        is_read: false,
      },
      { is_read: true }
    );

    const formattedMessages = messages.map((message) => formatMessage(message));

    res.status(200).json({ messages: formattedMessages });
  } catch (error) {
    console.error("Get private messages error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create message (room)
export const createRoomMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { roomId } = req.params as { roomId: string };
  const { content }: CreateMessageRequest = req.body;
  const senderId = (req as any).user.id;

  try {
    const newMessage = new Message({
      content,
      sender_id: new Types.ObjectId(senderId),
      room_id: new Types.ObjectId(roomId),
    });

    const savedMessage = await newMessage.save();
    const populatedMessage = await Message.findById(savedMessage._id).populate(
      "sender_id",
      "username profile_picture"
    );

    const formattedMessage = formatMessage(populatedMessage!);

    res.status(201).json({
      message: "Message sent successfully",
      data: formattedMessage,
    });
  } catch (error) {
    console.error("Create room message error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create message (private)
export const createPrivateMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params as { userId: string };
  const { content }: CreateMessageRequest = req.body;
  const senderId = (req as any).user.id;

  try {
    const newMessage = new Message({
      content,
      sender_id: new Types.ObjectId(senderId),
      receiver_id: new Types.ObjectId(userId),
    });

    const savedMessage = await newMessage.save();
    const populatedMessage = await Message.findById(savedMessage._id).populate(
      "sender_id",
      "username profile_picture"
    );

    const formattedMessage = formatMessage(populatedMessage!);

    res.status(201).json({
      message: "Private message sent successfully",
      data: formattedMessage,
    });
  } catch (error) {
    console.error("Create private message error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
