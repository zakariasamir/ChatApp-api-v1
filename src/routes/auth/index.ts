import { Router } from "express";
import root from "./root";

const router = Router();

/**
 * api/auth
 */
router.use("/", root);

export default router;
