import FoundItem from "../models/FoundItem.js";

export const createFoundItem = async (req, res) => {
  try {
    const {
      itemName,
      category,
      dateFound,
      locationFound,
      description,
      collectionInfo // ✅ IMPORTANT
    } = req.body;

    const foundItem = await FoundItem.create({
      itemName,
      category,
      dateFound,
      locationFound,
      description,
      collectionInfo, // ✅ SAVE THIS
      image: req.file ? req.file.filename : null
    });

    res.status(201).json({
      success: true,
      message: "Found item added successfully",
      foundItem
    });
  } catch (error) {
    console.error("Found Item Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add found item"
    });
  }
};