import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { Types } from "mongoose";

import { User, Message } from "../modules";
import { JWTPayload, SocketData, User as UserType } from "@/types";
import { formatUser } from "@/utils/mongodb";

interface AuthenticatedSocket extends Socket {
  user: SocketData;
}

interface RoomMessageData {
  roomId: string;
  content: string;
}

interface PrivateMessageData {
  receiverId: string;
  content: string;
}

interface TypingData {
  roomId?: string;
  receiverId?: string;
}

export default (io: Server): void => {
  // Map to store user socket connections
  const userSockets = new Map<string, string>();

  // Helper function to fetch and emit online users list
  const emitUsersList = async () => {
    try {
      const result = await User.services.fetchAll({
        query: { is_online: true },
        selection: ["username", "email", "profile_picture", "is_online"],
      });

      // Format users for the list
      const onlineUsers = (result.docs || []).map((user: UserType) => {
        const formatted = formatUser(user);
        return {
          id: formatted.id,
          username: formatted.username,
          email: formatted.email,
          profile_picture: formatted.profile_picture,
          is_online: formatted.is_online,
        };
      });

      // Emit to all connected clients
      io.emit("users:list", onlineUsers);
    } catch (error) {
      console.error("Error fetching online users list:", error);
    }
  };

  // Middleware for authentication
  io.use(async (socket: Socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");
      const token = cookies.token;

      if (!token) {
        return next(new Error("Authentication required"));
      }

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || ""
      ) as unknown as JWTPayload;

      // Find user
      const user = await User.services.fetchById({
        id: decoded.id as string,
      });

      if (!user) {
        return next(new Error("User not found"));
      }

      // Set user data on socket
      const formattedUser = formatUser(user);
      (socket as AuthenticatedSocket).user = {
        id: formattedUser.id,
        username: formattedUser.username,
        profile_picture: formattedUser.profile_picture,
      };

      next();
    } catch (error) {
      console.error("Socket authentication error:", error);
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", async (socket: Socket) => {
    const user = (socket as AuthenticatedSocket).user;

    // Add user to map
    userSockets.set(user.id, socket.id);

    // Update user status
    await User.services.updateOne({
      query: { _id: user.id },
      payload: { is_online: true },
    });

    // Notify all users (including the current user)
    io.emit("user:online", {
      id: user.id,
      username: user.username,
      profile_picture: user.profile_picture,
    });

    // Emit updated users list
    await emitUsersList();

    // Join a room
    socket.on("room:join", (roomId: string) => {
      socket.join(`room:${roomId}`);
    });

    // Leave a room
    socket.on("room:leave", (roomId: string) => {
      socket.leave(`room:${roomId}`);
    });

    // Listen for room messages
    socket.on("message:room", async (data: RoomMessageData) => {
      try {
        const { roomId, content } = data;

        // Insert message to database
        const newMessage = await Message.services.createOne({
          payload: {
            content,
            sender_id: new Types.ObjectId(user.id),
            room_id: new Types.ObjectId(roomId),
          },
        });

        // Broadcast to room
        io.to(`room:${roomId}`).emit("message:room", newMessage);
      } catch (error) {
        console.error("Room message error:", error);
      }
    });

    // Listen for private messages
    socket.on("message:private", async (data: PrivateMessageData) => {
      try {
        const { receiverId, content } = data;

        // Insert message to database
        const newMessage = await Message.services.createOne({
          payload: {
            content,
            sender_id: new Types.ObjectId(user.id),
            receiver_id: new Types.ObjectId(receiverId),
          },
        });

        // Get receiver socket
        const receiverSocketId = userSockets.get(receiverId);

        // Send to receiver if online
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("message:private", newMessage);
        }

        // Send back to sender
        socket.emit("message:private", newMessage);
      } catch (error) {
        console.error("Private message error:", error);
      }
    });

    // Typing indicators
    socket.on("typing:start", (data: TypingData) => {
      if (data.roomId) {
        // Room typing
        socket.to(`room:${data.roomId}`).emit("typing:start", {
          user: user,
          roomId: data.roomId,
        });
      } else if (data.receiverId) {
        // Private typing
        const receiverSocketId = userSockets.get(data.receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("typing:start", {
            user: user,
          });
        }
      }
    });

    socket.on("typing:stop", (data: TypingData) => {
      if (data.roomId) {
        // Room typing
        socket.to(`room:${data.roomId}`).emit("typing:stop", {
          user: user,
          roomId: data.roomId,
        });
      } else if (data.receiverId) {
        // Private typing
        const receiverSocketId = userSockets.get(data.receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("typing:stop", {
            user: user,
          });
        }
      }
    });

    // Handle disconnect
    socket.on("disconnect", async () => {
      // Remove from map
      userSockets.delete(user.id);

      // Update user status after a delay to handle page refresh
      setTimeout(async () => {
        // Check if user reconnected
        if (!userSockets.has(user.id)) {
          await User.services.updateOne({
            query: { _id: user.id },
            payload: { is_online: false },
          });

          // Notify all users
          io.emit("user:offline", {
            id: user.id,
          });

          // Emit updated users list
          await emitUsersList();
        }
      }, 5000);
    });
  });
};
