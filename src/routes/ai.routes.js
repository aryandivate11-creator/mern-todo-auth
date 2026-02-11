import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { chatWithAI } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/chat", authMiddleware, chatWithAI);

export default router;
