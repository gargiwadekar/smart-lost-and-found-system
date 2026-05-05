import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    lostItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LostItem",
    },
    foundItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoundItem",
    },
    status: {
      type: String,
      enum: ["pending", "requested", "approved", "rejected", "collected"],
      default: "pending",
    },
    confidence: {
      type: Number,
      default: 0,
    },
    verificationAnswers: {
      color: { type: String, default: "" },
      brand: { type: String, default: "" },
      uniqueMark: { type: String, default: "" },
    },
    approvalToken: {
      type: String,
      default: "",
    },
    requestedAt: Date,
    approvedAt: Date,
    collectedAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Match", matchSchema);
