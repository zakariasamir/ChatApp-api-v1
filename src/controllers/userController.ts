import { Request, Response } from "express";
import fs from "fs";

import { User } from "../modules";
import cloudinary from "../utils/cloudinary";
import { formatUser } from "../utils/mongodb";
import { AuthenticatedRequest } from "../types";

// Get all users
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find({})
      .select("username email profile_picture is_online")
      .sort({ username: 1 });

    const formattedUsers = users.map((user) => formatUser(user));

    res.status(200).json({ users: formattedUsers });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get online users
export const getOnlineUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find({ is_online: true })
      .select("username profile_picture")
      .sort({ username: 1 });

    const formattedUsers = users.map((user) => formatUser(user));

    res.status(200).json({ users: formattedUsers });
  } catch (error) {
    console.error("Get online users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update profile picture
export const updateProfilePicture = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "chat_app/profile_pictures",
      use_filename: true,
    });

    // Update user
    const user = (req as any).user;
    await User.findByIdAndUpdate(user._id, {
      profile_picture: result.secure_url,
    });

    // Remove file from local storage
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: "Profile picture updated successfully",
      profile_picture: result.secure_url,
    });
  } catch (error) {
    console.error("Update profile picture error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
