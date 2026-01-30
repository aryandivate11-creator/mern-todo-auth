import express from "express";
import multer from "multer";
import authMiddleware from "../middlewares/auth.middleware.js";
import { importTodos } from "../controllers/import.controller.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/", authMiddleware, upload.single("file"), importTodos);

export default router;
