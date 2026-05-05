import express from "express";
import { createLostItemAndMatch } from "../controllers/secureLostController.js";
import LostItem from "../models/LostItem.js";
import FoundItem from "../models/FoundItem.js";
import Match from "../models/Match.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js"; // ✅ ADD THIS

const router = express.Router();


// ✅ POST (WITH IMAGE UPLOAD)
router.post("/", protect, upload.single("image"), createLostItemAndMatch);


// ✅ GET ALL
router.get("/all", async (req, res) => {
  try {
    const lost = await LostItem.find().sort({ createdAt: -1 });
    const found = await FoundItem.find().select("-collectionInfo").sort({ createdAt: -1 });

    res.json({ lost, found });
  } catch (error) {
    console.error("FETCH ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ GET STATS
router.get("/stats", async (req, res) => {
  try {
    const totalLost = await LostItem.countDocuments();
    const totalFound = await FoundItem.countDocuments();
    const totalMatched = await LostItem.countDocuments({
      status: { $in: ["matched", "claimed", "requested", "approved", "collected"] },
    });
    const totalMatches = await Match.countDocuments();
    const pendingMatches = await Match.countDocuments({ status: "pending" });
    const requestedMatches = await Match.countDocuments({ status: "requested" });
    const approvedMatches = await Match.countDocuments({ status: "approved" });
    const rejectedMatches = await Match.countDocuments({ status: "rejected" });
    const collectedMatches = await Match.countDocuments({ status: "collected" });

    res.json({
      totalLost,
      totalFound,
      totalMatched,
      totalMatches,
      pendingMatches,
      requestedMatches,
      approvedMatches,
      rejectedMatches,
      collectedMatches,
    });
  } catch (error) {
    console.error("STATS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
