import Router from "express";
import root from "./root";

const router = Router();

/**
 * api/v1/rooms
 */
router.use("/", root);

export default router;
