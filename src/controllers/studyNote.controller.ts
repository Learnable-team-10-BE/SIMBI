import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import * as noteService from '../services/studyNote.service';

export const createNote = async (req: AuthenticatedRequest, res: Response) => {
  const { sessionId, content } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const note = await noteService.createNote(userId, sessionId, content);
  res.status(201).json(note);
};

export const updateNote = async (req: AuthenticatedRequest, res: Response) => {
  const { content } = req.body;
  const noteId = req.params.id;

  const updated = await noteService.updateNote(noteId, content);
  res.json(updated);
};

export const deleteNote = async (req: AuthenticatedRequest, res: Response) => {
  const noteId = req.params.id;

  await noteService.deleteNote(noteId);
  res.sendStatus(204);
};

export const getSessionNotes = async (req: AuthenticatedRequest, res: Response) => {
  const { sessionId } = req.params;
  const notes = await noteService.getNotesBySession(sessionId);
  res.json(notes);
};

