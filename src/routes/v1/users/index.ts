import { Router } from "express";
import root from "./root";
import userId from "./[userId]";
import auth from "@/middlewares/authMiddleware";

const router = Router({ mergeParams: true });

/**
 * api/v1/users
 */
router.use("/", auth as any, root);

/**
 * api/v1/users/[userId]
 */
router.use("/:userId", auth as any, userId);

export default router;
