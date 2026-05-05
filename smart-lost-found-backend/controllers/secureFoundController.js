import FoundItem from "../models/FoundItem.js";

export const createFoundItem = async (req, res) => {
  try {
    const {
      itemName,
      category,
      dateFound,
      locationFound,
      description,
      collectionInfo,
    } = req.body;

    if (!itemName || !category || !dateFound || !locationFound) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const foundItem = await FoundItem.create({
      itemName,
      category,
      dateFound,
      locationFound,
      description,
      collectionInfo,
      image: req.file ? req.file.filename : null,
      user: req.user._id,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Found item added successfully",
      foundItem,
    });
  } catch (error) {
    console.error("Found Item Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add found item",
    });
  }
};
