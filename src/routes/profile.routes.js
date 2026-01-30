import express from "express";
import { getProfile, connectSheet , updateProfile } from "../controllers/profile.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getProfile);
router.post("/connect-sheet", authMiddleware, connectSheet);
router.put("/", authMiddleware, updateProfile);

export default router;
