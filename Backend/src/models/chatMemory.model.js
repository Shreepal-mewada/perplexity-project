import mongoose from "mongoose";

const chatMemorySchema = new mongoose.Schema(
  {
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    shortSummary: { type: String, default: "" },
    recentSummary: { type: String, default: "" },
    keyPoints: [{ type: String }],
    decisions: [{ type: String }],
    unresolvedQuestions: [{ type: String }],
    activeTopics: [{ type: String }],
    importantEntities: [{ type: String }],
    lastProcessedMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    lastSummarizedAt: { type: Date, default: Date.now },
    summaryVersion: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  }
);

const chatMemoryModel =
  mongoose.models.ChatMemory || mongoose.model("ChatMemory", chatMemorySchema);

export default chatMemoryModel;
