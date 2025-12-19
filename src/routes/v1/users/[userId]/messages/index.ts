import { Router } from "express";
import root from "./root";

const router = Router({ mergeParams: true });

/**
 * api/v1/users/[userId]/messages
 */
router.use("/", root);

export default router;
