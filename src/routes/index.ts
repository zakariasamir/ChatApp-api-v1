import { Router } from "express";
import auth from "./auth";
import v1 from "./v1";

const router = Router();

/**
 * api/auth
 */
router.use("/auth", auth);

/**
 * api/v1
 */
router.use("/v1", v1);

export default router;
