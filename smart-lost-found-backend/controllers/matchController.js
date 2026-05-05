import Match from "../models/Match.js";
import LostItem from "../models/LostItem.js";
import FoundItem from "../models/FoundItem.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { buildMatchConfidence } from "../utils/matching.js";
import {
  sendClaimApprovedEmail,
  sendMatchVerificationEmail,
} from "../utils/emailService.js";

const exposeMatch = (match, userId) => {
  const matchObject = match.toObject();
  const foundUserId = matchObject.foundItem?.user?._id?.toString();
  const lostUserId = matchObject.lostItem?.user?._id?.toString();
  const isApproved = ["approved", "collected"].includes(matchObject.status);
  const canSeeCollection =
    isApproved || foundUserId === userId?.toString();

  if (!canSeeCollection && matchObject.foundItem) {
    delete matchObject.foundItem.collectionInfo;
  }

  matchObject.isLostOwner = lostUserId === userId?.toString();
  matchObject.isFoundOwner = foundUserId === userId?.toString();
  return matchObject;
};

const populateMatch = (query) =>
  query
    .populate({ path: "lostItem", populate: { path: "user", select: "name email" } })
    .populate({ path: "foundItem", populate: { path: "user", select: "name email" } });

const buildApprovalToken = (matchId, finderId) =>
  jwt.sign({ matchId, finderId }, process.env.JWT_SECRET, { expiresIn: "7d" });

const recalculateTrustScore = async (userId) => {
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

  const score = Math.min(
    100,
    successfulReturns * 30 + approvals * 10 + verifiedActions * 5
  );

  await User.findByIdAndUpdate(userId, { trustScore: score });
  return score;
};

export const createClaim = async (req, res) => {
  try {
    const { lostItemId, foundItemId, verificationAnswers = {} } = req.body;

    if (!lostItemId || !foundItemId) {
      return res.status(400).json({ message: "lostItemId and foundItemId are required" });
    }

    const lostItem = await LostItem.findById(lostItemId);
    const foundItem = await FoundItem.findById(foundItemId).populate("user", "name email");

    if (!lostItem || !foundItem) {
      return res.status(404).json({ message: "Lost or found item not found" });
    }

    if (lostItem.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the lost item owner can claim this item" });
    }

    const existingMatch = await populateMatch(
      Match.findOne({ lostItem: lostItemId, foundItem: foundItemId })
    );

    if (existingMatch) {
      return res.status(200).json({
        success: true,
        message: "Claim request already exists",
        match: exposeMatch(existingMatch, req.user._id),
      });
    }

    const confidenceData = buildMatchConfidence(lostItem, foundItem);
    const match = await Match.create({
      lostItem: lostItemId,
      foundItem: foundItemId,
      status: "requested",
      confidence: confidenceData.confidence,
      verificationAnswers,
      requestedAt: new Date(),
    });

    match.approvalToken = buildApprovalToken(match._id, foundItem.user._id);
    await match.save();

    lostItem.status = "requested";
    foundItem.status = "requested";
    await Promise.all([lostItem.save(), foundItem.save()]);

    await Notification.create({
      user: foundItem.user._id,
      type: "match",
      message: "New match found",
    });

    await sendMatchVerificationEmail({
      to: foundItem.user.email,
      approvalToken: match.approvalToken,
      foundItem,
      lostItem,
      verificationAnswers,
    });

    const populatedMatch = await populateMatch(Match.findById(match._id));

    res.status(201).json({
      success: true,
      message: "Claim request sent. Waiting for finder approval.",
      match: exposeMatch(populatedMatch, req.user._id),
    });
  } catch (error) {
    console.error("CREATE MATCH ERROR:", error);
    res.status(500).json({ message: "Error creating claim request" });
  }
};

export const getMatches = async (req, res) => {
  try {
    const matches = await populateMatch(
      Match.find()
        .sort({ createdAt: -1 })
    );

    const visibleMatches = matches
      .filter((match) => {
        const lostUser = match.lostItem?.user?._id?.toString();
        const foundUser = match.foundItem?.user?._id?.toString();
        return [lostUser, foundUser].includes(req.user._id.toString());
      })
      .map((match) => exposeMatch(match, req.user._id));

    res.json(visibleMatches);
  } catch (error) {
    console.error("FETCH MATCHES ERROR:", error);
    res.status(500).json({ message: "Error fetching matches" });
  }
};

export const updateMatchStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid match status" });
    }

    const match = await populateMatch(Match.findById(req.params.id));

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    if (match.foundItem.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the found item owner can update this claim" });
    }

    await setMatchStatus(match, status);

    const updatedMatch = await populateMatch(Match.findById(match._id));

    res.json({
      success: true,
      match: exposeMatch(updatedMatch, req.user._id),
      collectionInfo:
        status === "approved"
          ? updatedMatch.foundItem.collectionInfo || "No collection details provided"
          : undefined,
    });
  } catch (error) {
    console.error("UPDATE MATCH ERROR:", error);
    res.status(500).json({ message: "Error updating match" });
  }
};

export const verifyMatch = async (req, res) => {
  try {
    let matchId = req.params.matchId;
    let finderId = null;

    try {
      const decoded = jwt.verify(req.params.matchId, process.env.JWT_SECRET);
      matchId = decoded.matchId;
      finderId = decoded.finderId;
    } catch {
      matchId = req.params.matchId;
    }

    const match = await populateMatch(Match.findById(matchId));

    if (!match) {
      return res.status(404).send("Match not found");
    }

    if (finderId && match.foundItem.user._id.toString() !== finderId.toString()) {
      return res.status(403).send("Invalid approval token");
    }

    await setMatchStatus(match, "approved");

    res.send("Claim approved. Collection details were sent to the lost item owner.");
  } catch (error) {
    console.error("VERIFY MATCH ERROR:", error);
    res.status(500).send("Error approving match");
  }
};

export const confirmCollection = async (req, res) => {
  try {
    const { collected } = req.body;
    const match = await populateMatch(Match.findById(req.params.id));

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    if (match.lostItem.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the claimer can confirm collection" });
    }

    if (match.status !== "approved" && match.status !== "collected") {
      return res.status(400).json({ message: "Match must be approved before collection" });
    }

    if (!collected) {
      return res.json({
        success: true,
        message: "Collection remains pending",
        match: exposeMatch(match, req.user._id),
      });
    }

    await setMatchStatus(match, "collected");
    const updatedMatch = await populateMatch(Match.findById(match._id));

    res.json({
      success: true,
      message: "Collection confirmed",
      match: exposeMatch(updatedMatch, req.user._id),
    });
  } catch (error) {
    console.error("COLLECTION ERROR:", error);
    res.status(500).json({ message: "Error confirming collection" });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(notifications);
  } catch (error) {
    console.error("NOTIFICATION ERROR:", error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

const setMatchStatus = async (match, status) => {
  match.status = status;
  await match.save();

  const lostItem = match.lostItem;
  const foundItem = match.foundItem;

  if (status === "approved") {
    match.approvedAt = match.approvedAt || new Date();
    await match.save();
    lostItem.status = "approved";
    foundItem.status = "approved";

    await Notification.create({
      user: lostItem.user._id,
      type: "approved",
      message: "Your claim was approved",
    });

    await sendClaimApprovedEmail({
      to: lostItem.user.email,
      foundItem,
      lostItem,
    });

    await Promise.all([
      recalculateTrustScore(lostItem.user._id),
      recalculateTrustScore(foundItem.user._id),
    ]);
  }

  if (status === "collected") {
    match.collectedAt = new Date();
    match.completedAt = new Date();
    await match.save();

    lostItem.status = "collected";
    foundItem.status = "collected";

    await Notification.create({
      user: foundItem.user._id,
      type: "approved",
      message: "Item collection was confirmed",
    });

    await Promise.all([
      recalculateTrustScore(lostItem.user._id),
      recalculateTrustScore(foundItem.user._id),
    ]);
  }

  if (status === "rejected") {
    lostItem.status = "matched";
    foundItem.status = "matched";

    await Notification.create({
      user: lostItem.user._id,
      type: "rejected",
      message: "Your claim was rejected",
    });
  }

  await Promise.all([lostItem.save(), foundItem.save()]);
};
