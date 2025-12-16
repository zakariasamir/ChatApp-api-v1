import { User } from "@/modules";
import { Router, Request, Response } from "express";

const router = Router();

/**
 * GET /api/v1/users
 */
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({});
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
