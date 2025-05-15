import { Request, Response } from "express";
import * as sessionService from "../services/studySession.service";

export const startSession = async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const session = await sessionService.startSession(sessionId);
      return res.status(200).json({ success: true, session });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
};

export const pauseSession = async (req: Request, res: Response) => {
  const sessionId = req.params.id;

  try {
    const session = await sessionService.pauseSession(sessionId);
    res.status(200).json(session);
  } catch (error) {
    res.status(400).json({ message: "Error pausing session", error });
  }
};

export const resumeSession = async (req: Request, res: Response) => {
  const sessionId = req.params.id;

  try {
    const session = await sessionService.resumeSession(sessionId);
    res.status(200).json(session);
  } catch (error) {
    res.status(400).json({ message: "Error resuming session", error });
  }
};

export const completeSession = async (req: Request, res: Response) => {
  const sessionId = req.params.id;

  try {
    const session = await sessionService.completeSession(sessionId);
    res.status(200).json(session);
  } catch (error) {
    res.status(400).json({ message: "Error completing session", error });
  }
};
