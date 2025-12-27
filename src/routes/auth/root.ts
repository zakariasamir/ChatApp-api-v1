// In src/routes/v1/auth/root.ts
import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import cloudinary from "@/utils/cloudinary";
import { User } from "@/modules";
import { formatUser } from "@/utils/mongodb";
import {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  UserResponse,
} from "@/types";
import upload from "@/middlewares/upload";
import auth from "@/middlewares/authMiddleware";
import { validateRegister, validateLogin } from "@/middlewares/validator";
import fs from "fs";
import jwt from "jsonwebtoken";

const router = Router();

/**
 * POST /api/auth/register
 */
router.post(
  "/register",
  upload.single("profile_picture"),
  validateRegister,
  async (req: Request, res: Response): Promise<void> => {
    const { username, email, password }: RegisterRequest = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.services.exists({
        query: {
          $or: [{ email }, { username }],
        },
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
      const newUser = await User.services.createOne({
        payload: {
          username,
          email,
          password: hashedPassword,
          profile_picture: profilePicture,
        },
      });

      const response: AuthResponse = {
        message: "User registered successfully",
        user: formatUser(newUser),
      };

      res.status(201).json(response);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * POST /api/auth/login
 */
router.post(
  "/login",
  validateLogin,
  async (req: Request, res: Response): Promise<void> => {
    const { email, password }: LoginRequest = req.body;

    try {
      console.log({ email, password });
      // Check if user exists
      const user = await User.services.fetchOne({
        query: { email },
      });

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
      await User.services.updateOne({
        query: { _id: user._id },
        payload: { is_online: true },
      });

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
        sameSite: "lax",
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
  }
);

/**
 * POST /api/auth/logout
 */
router.post(
  "/logout",
  auth as any,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).user;
      console.log(user);
      // Update online status
      await User.services.updateOne({
        query: { _id: user._id },
        payload: { is_online: false },
      });

      // Clear cookie
      res.clearCookie("token");

      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * GET /api/auth/me
 */
router.get(
  "/me",
  auth as any,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const authUser = (req as any).user;
      const user = await User.services.fetchOne({
        query: { _id: authUser._id },
        selection: ["username", "email", "profile_picture", "is_online"],
      });

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
  }
);

export default router;
