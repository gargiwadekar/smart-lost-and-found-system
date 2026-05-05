import User from "../models/User.js";
import LostItem from "../models/LostItem.js";
import FoundItem from "../models/FoundItem.js";
import Match from "../models/Match.js";

const calculateTrustScore = async (userId) => {
  const matches = await Match.find({
    status: { $in: ["requested", "approved", "collected"] },
  })
    .populate("lostItem")
    .populate("foundItem");

  const userMatches = matches.filter((match) => {
    const lostUser = match.lostItem?.user?.toString();
    const foundUser = match.foundItem?.user?.toString();
    return [lostUser, foundUser].includes(userId.toString());
  });

  const successfulReturns = userMatches.filter(
    (match) => match.status === "collected"
  ).length;
  const approvals = userMatches.filter((match) =>
    ["approved", "collected"].includes(match.status)
  ).length;
  const verifiedActions = userMatches.length;

  return Math.min(
    100,
    successfulReturns * 30 + approvals * 10 + verifiedActions * 5
  );
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const [lostItems, foundItems, matches] = await Promise.all([
      LostItem.find({ user: userId }).sort({ createdAt: -1 }),
      FoundItem.find({ user: userId }).select("-collectionInfo").sort({ createdAt: -1 }),
      Match.find()
        .populate({ path: "lostItem", populate: { path: "user", select: "name email" } })
        .populate({ path: "foundItem", populate: { path: "user", select: "name email" } })
        .sort({ createdAt: -1 }),
    ]);

    const userMatches = matches.filter((match) => {
      const lostUser = (match.lostItem?.user?._id || match.lostItem?.user)?.toString();
      const foundUser = (match.foundItem?.user?._id || match.foundItem?.user)?.toString();
      return [lostUser, foundUser].includes(userId.toString());
    });

    const trustScore = await calculateTrustScore(userId);
    await User.findByIdAndUpdate(userId, { trustScore });

    const activity = [
      ...lostItems.map((item) => ({
        itemName: item.itemName,
        type: "Lost",
        status: item.status || "pending",
        date: item.createdAt,
      })),
      ...foundItems.map((item) => ({
        itemName: item.itemName,
        type: "Found",
        status: item.status || "pending",
        date: item.createdAt,
      })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    const history = userMatches
      .filter((match) => match.status === "collected")
      .map((match) => ({
        itemName: match.lostItem?.itemName || match.foundItem?.itemName || "-",
        matchedUser:
          match.lostItem?.user?._id?.toString() === userId.toString()
            ? match.foundItem?.user?.name || "-"
            : match.lostItem?.user?.name || "-",
        status: match.status,
        completedAt: match.completedAt || match.collectedAt,
      }));

    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        profileImage: req.user.profileImage,
        trustScore,
      },
      stats: {
        totalLostItems: lostItems.length,
        totalFoundItems: foundItems.length,
        totalMatches: userMatches.length,
        successfulRecoveries: userMatches.filter(
          (match) => match.status === "collected"
        ).length,
      },
      activity,
      history,
    });
  } catch (error) {
    console.error("PROFILE ERROR:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim() },
      { new: true }
    ).select("-password");

    res.json({ message: "Profile updated", user });
  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Profile image is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: req.file.filename },
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile photo uploaded",
      profileImage: user.profileImage,
      user,
    });
  } catch (error) {
    console.error("PHOTO UPLOAD ERROR:", error);
    res.status(500).json({ message: "Error uploading profile photo" });
  }
};
