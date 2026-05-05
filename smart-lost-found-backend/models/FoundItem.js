import mongoose from "mongoose";

const foundItemSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    category: { type: String, required: true },
    dateFound: { type: Date, required: true },
    locationFound: { type: String, required: true },
    description: String,
    image: String,

    // ✅ IMPORTANT FIELD
    collectionInfo: {
      type: String,
      default: "",
    },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "matched", "claimed", "requested", "approved", "collected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("FoundItem", foundItemSchema);
