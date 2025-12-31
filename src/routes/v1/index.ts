import { Router } from "express";
import users from "./users";
import rooms from "./rooms";

const router = Router();

/**
 * api/v1/users
 */
router.use("/users", users);

/**
 * api/v1/rooms
 */
router.use("/rooms", rooms);

export default router;
