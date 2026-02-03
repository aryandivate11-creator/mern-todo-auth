import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import multer from "multer";
import {
  getProfile,
  updateProfile,
  uploadProfilePic
} from "../controllers/profile.controller.js";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });


const router = express.Router();

router.get("/", authMiddleware, getProfile);
router.put("/", authMiddleware, updateProfile);

router.post(
  "/upload-photo",
  authMiddleware,
  upload.single("photo"),
  uploadProfilePic
);

export default router;
