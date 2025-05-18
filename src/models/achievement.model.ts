import mongoose, { Schema, Document } from "mongoose";

export interface IAchievement extends Document {
  userId: mongoose.Types.ObjectId;
  key: string; // e.g. "study_streak_5"
  name: string; // e.g. "Study Streak – 5 Sessions"
  description: string;
  txHash: string;
  tokenURI: string;
  image: string;
  earnedAt: Date;
  achievementType: number; // 0 = MathMaster, etc.
}

const AchievementSchema = new Schema<IAchievement>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    key: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    txHash: { type: String, required: true },
    tokenURI: { type: String, required: true },
    image: { type: String, required: true },
    earnedAt: { type: Date, default: Date.now },
    achievementType: { type: Number, enum: [0, 1, 2], required: true }, // 🆕
  },
  { timestamps: true }
);

export default mongoose.model<IAchievement>("Achievement", AchievementSchema);

