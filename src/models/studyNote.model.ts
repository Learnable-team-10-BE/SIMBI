import mongoose, { Schema, Document } from 'mongoose';

export interface IStudyNote extends Document {
  userId: string;
  sessionId: string;
  content: string;
}

const StudyNoteSchema = new Schema<IStudyNote>(
  {
    userId: { type: String, required: true },
    sessionId: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const StudyNote = mongoose.model<IStudyNote>('StudyNote', StudyNoteSchema);
