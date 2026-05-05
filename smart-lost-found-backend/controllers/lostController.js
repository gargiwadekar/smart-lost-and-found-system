import LostItem from "../models/LostItem.js";
import FoundItem from "../models/FoundItem.js";

export const createLostItemAndMatch = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    // ✅ Safe data handling (same as your logic)
    const lostData = {
      ...req.body,
      image: req.file ? req.file.filename : null,
      dateLost: req.body.dateLost
        ? new Date(req.body.dateLost)
        : null,
    };

    // ✅ Validation (same)
    if (!lostData.itemName || !lostData.category || !lostData.locationLost) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // 1️⃣ Save lost item (same)
    const lostItem = await LostItem.create(lostData);

    // 2️⃣ MATCHING (same logic — only ensured full data comes)
    const matches = await FoundItem.find({
      itemName: {
        $regex: lostItem.itemName,
        $options: "i",
      },
    });

    console.log("MATCHES FULL DATA:", matches);

    // 3️⃣ Response (same)
    res.status(200).json({
      success: true,
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