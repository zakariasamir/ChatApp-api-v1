import { Router } from "express";
import root from "./root";

const router = Router();

/**
 * api/v1/auth
 */
router.use("/", root);

export default router;
