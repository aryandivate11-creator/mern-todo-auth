import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { uploadProfile } from "../middlewares/upload.middleware.js";
import {
  getProfile,
  updateProfile,
  uploadProfilePic
} from "../controllers/profile.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getProfile);
router.put("/", authMiddleware, updateProfile);

router.post(
  "/upload-photo",
  authMiddleware,
  uploadProfile.single("photo"),
  uploadProfilePic
);

export default router;
