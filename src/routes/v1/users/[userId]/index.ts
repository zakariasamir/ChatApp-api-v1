import { Router } from "express";
import root from "./root";
import messages from "./messages";

const router = Router({ mergeParams: true });

/**
 * api/v1/users/[userId]
 */
router.use("/", root);

/**
 * api/v1/users/[userId]/messages
 */
router.use("/messages", messages);

export default router;
