import LostItem from "../models/LostItem.js";
import FoundItem from "../models/FoundItem.js";
import Notification from "../models/Notification.js";
import { buildMatchConfidence } from "../utils/matching.js";

export const createLostItemAndMatch = async (req, res) => {
  try {
    const lostData = {
      ...req.body,
      image: req.file ? req.file.filename : null,
      dateLost: req.body.dateLost ? new Date(req.body.dateLost) : null,
    };

    if (!lostData.itemName || !lostData.category || !lostData.locationLost) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const lostItem = await LostItem.create({
      ...lostData,
      user: req.user._id,
      status: "pending",
    });

    const foundItems = await FoundItem.find().populate("user", "name email");
    const lostRegex = new RegExp(lostItem.itemName, "i");

    const matches = foundItems
      .map((foundItem) => {
        const confidenceData = buildMatchConfidence(lostItem, foundItem);
        const regexFallback =
          lostRegex.test(foundItem.itemName) ||
          new RegExp(foundItem.itemName, "i").test(lostItem.itemName);

        if (confidenceData.textScore <= 0.4 && !regexFallback) return null;

        const item = foundItem.toObject();
        item.itemStatus = item.status;
        delete item.collectionInfo;
        delete item.status;

        return {
          ...item,
          lostItemId: lostItem._id,
          matchConfidence: confidenceData.confidence,
          imageMatchScore: Math.round(confidenceData.imageScore * 100),
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.matchConfidence - a.matchConfidence);

    if (matches.length > 0) {
      lostItem.status = "matched";
      await lostItem.save();

      await Notification.create({
        user: req.user._id,
        type: "match",
        message: "New match found",
      });
    }

    res.status(200).json({
      success: true,
      lostItem,
      matches,
      message:
        matches.length > 0
          ? "Matching items found"
          : "No matching items found yet. Please check later.",
    });
  } catch (error) {
    console.error("MATCH ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
