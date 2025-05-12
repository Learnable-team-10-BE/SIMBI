import { Request, Response } from "express";
import * as quizHistoryService from "../services/quizHistory.service";
import { mongoDbIdSchema } from "@/validators/quiz.validator";
import { z } from "zod";

export const getTotalQuizHistoryHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.user || {};
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const history = await quizHistoryService.getTotalQuizHistory(userId);
    res.status(200).json({ success: true, data: history });
  } catch (error: any) {
    console.error("Controller error:", error.message);
    if (error instanceof Error) {
      return res.status(500).json({ success: false, message: error.message });
    }
    res
      .status(500)
      .json({ success: false, message: "An unexpected error occurred" });
  }
};

export const getQuizHistoryByIdHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.user || {};
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const quizId = mongoDbIdSchema.parse(req.params.quizId);
    if (!quizId) {
      return res
        .status(400)
        .json({ success: false, message: "Quiz ID is required" });
    }

    const history = await quizHistoryService.getQuizHistoryById(quizId, userId);
    res.status(200).json({ success: true, data: history });
  } catch (error: any) {
    console.error("Controller error:", error.message);
    if (error instanceof Error) {
      return res.status(500).json({ success: false, message: error.message });
    }
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }
    res
      .status(500)
      .json({ success: false, message: "An unexpected error occurred" });
  }
};
