import mongoose from "mongoose";

const lostItemSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    category: { type: String, required: true },
    dateLost: { type: Date },
    locationLost: { type: String, required: true },
    description: String,
    image: String,

    // ✅ NEW FIELD
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "matched", "claimed", "requested", "approved", "collected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("LostItem", lostItemSchema);
