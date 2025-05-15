import mongoose, { Schema, Document } from 'mongoose';

export interface IStudyResource extends Document {
  userId: string;
  sessionId: string;
  title: string;
  format: string;
  url: string;
  filePath?: string;
}

const StudyResourceSchema = new Schema<IStudyResource>(
  {
    userId: { type: String, required: true },
    sessionId: { type: String, required: true },
    title: { type: String, required: true },
    format: { type: String },
    url: { type: String },
    filePath: { type: String },
  },
  { timestamps: true }
);

export const StudyResource = mongoose.model<IStudyResource>('StudyResource', StudyResourceSchema);
