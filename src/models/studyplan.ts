import { Schema, model, Document } from "mongoose";

export interface IStudySession extends Document {
  userId: string;
  subject: string;
  topic: string;
  date: Date;
  time: string;
  duration: number; 
  status: "upcoming" | "missed" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

const StudySessionSchema = new Schema<IStudySession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true } as any,
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true }, 
    duration: { type: Number, required: true }, 
    status: {
      type: String,
      enum: ["upcoming", "missed", "completed"],
      default: "upcoming",
    },
  },
  {
    timestamps: true, 
  }
);

export default model<IStudySession>("StudySession", StudySessionSchema);
