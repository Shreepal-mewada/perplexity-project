import mongoose from "mongoose";

const userMemorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    memoryType: {
      type: String,
      enum: [
        "project",
        "preference",
        "goal",
        "fact",
        "constraint",
        "stack",
        "decision",
      ],
      required: true,
    },
    content: { type: String, required: true },
    tags: [{ type: String }],
    projectKey: { type: String, default: "general" },
    importanceScore: { type: Number, min: 1, max: 10, default: 5 },
    confidenceScore: { type: Number, min: 0, max: 1, default: 1.0 },
    status: {
      type: String,
      enum: ["active", "stale", "replaced", "archived"],
      default: "active",
    },
    sourceChat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    lastAccessedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Automatically includes createdAt and updatedAt
  }
);

// Indexes for query performance and basic relevance matching
userMemorySchema.index({ user: 1, status: 1 });
userMemorySchema.index({ user: 1, projectKey: 1 });
userMemorySchema.index({ content: "text", tags: "text" }); // For initial fetch cap

const userMemoryModel =
  mongoose.models.UserMemory || mongoose.model("UserMemory", userMemorySchema);

export default userMemoryModel;
