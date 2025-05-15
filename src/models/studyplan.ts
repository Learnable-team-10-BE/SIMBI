import { Schema, model, Document } from "mongoose";

export interface IStudySession extends Document {
  userId: string;
  subject: string;
  topic: string;
  date: Date;
  time: string;
  duration: number; // in minutes (planned duration)
  status: "upcoming" | "missed" | "completed" | "active" | "paused";
  createdAt: Date;
  updatedAt: Date;

  actualStartTime: Date;
  actualEndTime: Date;
  totalElapsedTime: number; // in seconds
  active: boolean;
}

const StudySessionSchema = new Schema<IStudySession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true } as any,
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    duration: { type: Number, required: true }, // in minutes
    status: {
      type: String,
      enum: ["upcoming", "missed", "completed", "active", "paused"],
      default: "upcoming",
    },

    actualStartTime: { type: Date },
    actualEndTime: { type: Date },
    totalElapsedTime: { type: Number, default: 0 }, // in seconds
    active: { type: Boolean, default: false }, // true = currently active
  },
  {
    timestamps: true,
  }
);

export default model<IStudySession>("StudySession", StudySessionSchema);

