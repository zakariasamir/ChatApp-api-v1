import { User } from "@/modules";
import { Router, Request, Response } from "express";

const router = Router();

/**
 * GET /api/v1/users/[userId]
 */
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await User.services.fetchById({
      query: { _id: userId },
      selection: ["username", "email", "profile_picture"],
    });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
