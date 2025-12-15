import Router from "express";
import root from "./root";

const router = Router();

/**
 * api/v1/rooms/[roomId]
 */
router.use("/:roomId", root);

export default router;
