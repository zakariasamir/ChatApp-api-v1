import { Router } from "express";
import root from "./root";
import messages from "./messages";
import users from "./users";
import auth from "@/middlewares/authMiddleware";

const router = Router({ mergeParams: true });

/**
 * api/v1/rooms/[roomId]
 */
router.use("/", auth as any, root);

/**
 * api/v1/rooms/[roomId]/messages
 */
router.use("/messages", auth as any, messages);

/**
 * api/v1/rooms/[roomId]/users
 */
router.use("/users", auth as any, users);

export default router;
