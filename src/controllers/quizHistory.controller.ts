import { Request, Response } from "express";
import * as quizHistoryService from "../services/quizHistory.service";

export const getQuizHistoryHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const history = await quizHistoryService.getQuizHistory(userId);
    res.status(200).json({ success: true, data: history });
  } catch (error: any) {
    console.error("Controller error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};