import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, trim: true, default: "New Chat" },
    // messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  },
  {
    timestamps: true,
  },
);

const chatModel = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
export default chatModel;
