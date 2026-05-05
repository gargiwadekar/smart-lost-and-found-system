import express from "express";
import Match from "../models/Match.js";
import {
  createClaim,
  confirmCollection,
  getMatches,
  getNotifications,
  updateMatchStatus,
  verifyMatch,
} from "../controllers/matchController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// ✅ GET ALL MATCHES
router.get("/legacy", async (req, res) => {
  try {
    const matches = await Match.find()
      .populate("lostItem")
      .populate("foundItem")
      .sort({ createdAt: -1 });

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: "Error fetching matches" });
  }
});


// ✅ UPDATE STATUS (🔥 FIXED)
router.put("/legacy/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const match = await Match.findById(req.params.id)
      .populate("foundItem")   // ✅ IMPORTANT
      .populate("lostItem");

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    match.status = status;
    await match.save();

    res.json({
      success: true,
      match,
      collectionInfo:
        match.foundItem?.collectionInfo ||
        "No collection details provided",
    });

  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ message: "Error updating match" });
  }
});

router.get("/verify/:matchId", verifyMatch);
router.get("/notifications", protect, getNotifications);
router.get("/", protect, getMatches);
router.post("/", protect, createClaim);
router.put("/:id", protect, updateMatchStatus);
router.put("/:id/collection", protect, confirmCollection);

export default router;
