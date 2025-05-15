import { StudyNote } from '../models/studyNote.model';

export const createNote = async (userId: string, sessionId: string, content: string) => {
  return await StudyNote.create({ userId, sessionId, content });
};

export const updateNote = async (noteId: string, content: string) => {
  return await StudyNote.findByIdAndUpdate(noteId, { content }, { new: true });
};

export const deleteNote = async (noteId: string) => {
  return await StudyNote.findByIdAndDelete(noteId);
};

export const getNotesBySession = async (sessionId: string) => {
  return await StudyNote.find({ sessionId });
};
