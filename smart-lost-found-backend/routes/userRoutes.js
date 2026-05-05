import express from "express";
import {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/update", protect, updateProfile);
router.post("/upload-photo", protect, upload.single("profileImage"), uploadProfilePhoto);

export default router;
