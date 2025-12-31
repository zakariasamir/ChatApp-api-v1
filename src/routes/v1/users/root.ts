import { User } from "@/modules";
import { Router, Request, Response } from "express";

const router = Router({ mergeParams: true });

/**
 * GET /api/v1/users
 */
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.services.fetchAll({
      query: {
        selection: ["username", "email", "profile_picture"],
      },
    });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
