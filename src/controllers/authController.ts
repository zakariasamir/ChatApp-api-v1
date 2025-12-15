import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import { Request, Response } from "express";
import { Types } from "mongoose";

import { User } from "@/models";
import cloudinary from "../utils/cloudinary";
import { formatUser } from "../utils/mongodb";
import {
  AuthenticatedRequest,
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  UserResponse,
  CreateUserData,
} from "../types";

// Register user
export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password }: RegisterRequest = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Handle profile picture upload
    let profilePicture =
      "https://res.cloudinary.com/demo/image/upload/v1580125066/samples/people/default-profile.jpg";

    if (req.file) {
      // Upload to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "chat_app/profile_pictures",
        use_filename: true,
      });

      profilePicture = result.secure_url;

      // Remove file from local storage
      fs.unlinkSync(req.file.path);
    }

    // Create user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profile_picture: profilePicture,
    });

    const savedUser = await newUser.save();

    const response: AuthResponse = {
      message: "User registered successfully",
      user: formatUser(savedUser),
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password }: LoginRequest = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // Update online status
    await User.findByIdAndUpdate(user._id, { is_online: true });

    // Create token
    const token = jwt.sign(
      { id: formatUser(user).id },
      process.env.JWT_SECRET!,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      } as any
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const response: AuthResponse = {
      message: "Login successful",
      user: formatUser(user),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Logout user
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    console.log(user);
    // Update online status
    await User.findByIdAndUpdate(user._id, { is_online: false });

    // Clear cookie
    res.clearCookie("token");

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get current user
export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const authUser = (req as any).user;
    const user = await User.findById(authUser._id).select(
      "username email profile_picture"
    );

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const response: UserResponse = {
      user: formatUser(user),
    };
    res.status(200).json(response);
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const authUser = (req as any).user;
    const user = await User.findById(authUser._id).select(
      "username email profile_picture"
    );
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
