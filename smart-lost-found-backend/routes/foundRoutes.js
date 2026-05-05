import express from "express";
import multer from "multer";
import { createFoundItem } from "../controllers/secureFoundController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ============================= */
/* MULTER CONFIG (CORRECT) */
/* ============================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ============================= */
/* ROUTES */
/* ============================= */

router.post("/", protect, upload.single("image"), createFoundItem);

/* ============================= */
/* EXPORT */
/* ============================= */
export default router;
