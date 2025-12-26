import { Router } from "express";
import root from "./root";
import roomId from "./[roomId]";
import auth from "@/middlewares/authMiddleware";

const router = Router({ mergeParams: true });

/**
 * api/v1/rooms
 */
router.use("/", auth as any, root);

/**
 * api/v1/rooms/[roomId]
 */
router.use("/:roomId", auth as any, roomId);

export default router;
