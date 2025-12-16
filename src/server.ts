import express, { Request, Response, NextFunction } from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import dotenv from "dotenv";
import "./config/db";
import socketService from "./services/socket";
import { EnvironmentVariables } from "./types";
import { errorHandler, notFound } from "./middlewares/errorHandler";
import v1 from "./routes/v1";

// Load environment variables
dotenv.config();

const PORT = process.env.SERVER_PORT || 5004;

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS settings
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Initialize socket.io
socketService(io);

// Routes
app.use("/api/v1", v1);

// Health check route
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// API info route
app.get("/api", (req: Request, res: Response) => {
  res.status(200).json({
    name: "ChatApp API",
    version: "1.0.0",
    description: "Real-time chat application API with Socket.IO",
    endpoints: {
      auth: "/api/v1/auth",
      users: "/api/v1/users",
      rooms: "/api/v1/rooms",
      messages: "/api/v1/messages",
      health: "/api/v1/health",
    },
  });
});

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.IO ready for connections`);
  console.log(`🌍 Client URL: ${process.env.CLIENT_URL}`);
});
