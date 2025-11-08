import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
      enum: ["plu", "plu-exam", "apt", "wai", "wai-exam"],
    },
    mode: {
      type: String,
      required: true,
      enum: ["standard", "AI"],
      default: "standard",
    },
    score: {
      type: Number,
      required: true,
      min: 0,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    attempted: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    timeTaken: {
      type: Number,
      default: null,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

leaderboardSchema.index({ subject: 1, score: -1 });
leaderboardSchema.index({ user: 1, completedAt: -1 });
leaderboardSchema.index({ percentage: -1, completedAt: -1 });

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);

export default Leaderboard;
