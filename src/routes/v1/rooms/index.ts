import { Router } from "express";
import root from "./root";
import roomId from "./[roomId]";

const router = Router({ mergeParams: true });

/**
 * api/v1/rooms
 */
router.use("/", root);

/**
 * api/v1/rooms/[roomId]
 */
router.use("/:roomId", roomId);

export default router;
