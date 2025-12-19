import { Router } from "express";
import root from "./root";
import userId from "./[userId]";

const router = Router({ mergeParams: true });

/**
 * api/v1/users
 */
router.use("/", root);

/**
 * api/v1/users/[userId]
 */
router.use("/:userId", userId);

export default router;
