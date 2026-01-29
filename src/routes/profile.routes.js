import express from "express";
import { getProfile, connectSheet } from "../controllers/profile.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getProfile);
router.post("/connect-sheet", authMiddleware, connectSheet);

export default router;
