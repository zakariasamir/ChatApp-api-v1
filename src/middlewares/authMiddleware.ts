import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import { User } from "@/modules";
import { AuthenticatedRequest, JWTPayload } from "@/types";

const auth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from cookies
    const token = (req as any).cookies.token;

    if (!token) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

    // Find user
    const user = await User.services.fetchById({
      id: decoded.id as string,
      selection: ["username", "email", "profile_picture", "is_online"],
    });

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    // Add user to request
    req.user = {
      _id: user._id as any,
      username: user.username,
      email: user.email,
      password: user.password,
      profile_picture: user.profile_picture,
      is_online: user.is_online,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Authentication failed" });
  }
};

export default auth;
