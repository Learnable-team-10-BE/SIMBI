import { Request, Response } from "express";
import * as sessionService from "../services/studySession.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { grantAchievementNFT } from "../services/achievement.service";
import { Types } from "mongoose";

export const startSession = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { sessionId } = req.params;
      const session = await sessionService.startSession(sessionId);
      return res.status(200).json({ success: true, session });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
};

export const pauseSession = async (req: AuthenticatedRequest, res: Response) => {
  const sessionId = req.params.id;

  try {
    const session = await sessionService.pauseSession(sessionId);
    res.status(200).json(session);
  } catch (error) {
    res.status(400).json({ message: "Error pausing session", error });
  }
};

export const resumeSession = async (req: AuthenticatedRequest, res: Response) => {
  const sessionId = req.params.id;

  try {
    const session = await sessionService.resumeSession(sessionId);
    res.status(200).json(session);
  } catch (error) {
    res.status(400).json({ message: "Error resuming session", error });
  }
};

// export const completeSession = async (req: Request, res: Response) => {
//   const sessionId = req.params.id;

//   try {
//     const session = await sessionService.completeSession(sessionId);
//     res.status(200).json(session);
//   } catch (error) {
//     res.status(400).json({ message: "Error completing session", error });
//   }
// }; 

export const completeSession = async (req: Request, res: Response) => {
  try {
    const { id: sessionId } = req.params;
    const { user } = req as any; // or use your AuthenticatedRequest type

    if (!user || !user.userId || !user.walletAddress) {
      return res.status(400).json({
        success: false,
        message: "Missing user ID or wallet address",
      });
    }

    // Validate and convert userId to ObjectId
    if (!Types.ObjectId.isValid(user.userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const userId = new Types.ObjectId(user.userId);
    const walletAddress = user.walletAddress;

    const session = await sessionService.completeSession(sessionId);

    // Check if ended early using the 'endedEarly' property
    if (session.endedEarly) {
      await grantAchievementNFT(userId, walletAddress, "Fast_Learner");
    }

    return res.status(200).json({ success: true, session });
  } catch (error: any) {
    console.error("Error completing session:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};
