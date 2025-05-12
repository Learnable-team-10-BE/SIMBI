import { Request, Response } from "express";
import mongoose from "mongoose";
import { IQuizInput } from "../interfaces/quiz.types";
import * as quizService from "../services/quiz.service";
import multer from "multer";
import { IQuiz } from "../models/quiz.model";
import {
  mongoDbIdSchema,
  submitAnswerSchema,
} from "../validators/quiz.validator";
import { z } from "zod";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email?: string;
  };
}

const upload = multer({ dest: "uploads/" });

export const generateQuizHandler = [
  upload.single("file"),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const input: IQuizInput = req.body;

      const { userId } = req?.user || {};
      console.log("User ID from request:", userId);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: No userId provided",
        });
      }

      if (req.file) {
        input.file = req.file;
      }
      const quiz = (await quizService.createQuiz(userId, input)) as IQuiz;
      console.log("Quiz created with ID:", quiz._id);
      res.status(200).json({
        success: true,
        quizId: quiz._id.toString(),
        data: quiz, // Send the full quiz object instead of just questions
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
      }
      console.error("Controller error:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  },
];

export const submitAnswerHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const quizId = mongoDbIdSchema.parse(req.params.quizId);
    const input = submitAnswerSchema.parse(req.body);
    const { questionIndex, answer } = input;

    const { userId } = req.user || {};

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Validate quizId
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      res.status(400).json({ error: "Invalid quizId format" });
    }

    const quiz = await quizService.submitAnswer(
      userId,
      quizId,
      questionIndex,
      answer
    );
    res.status(200).json({ progress: quiz.progress });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      // Handle validation errors
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: err.errors,
      });
    }
    console.error("Controller error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getQuizHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { userId } = req.user || {};
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }
    const quizId = mongoDbIdSchema.parse(req.params.quizId);

    const quiz = await quizService.getQuizById(quizId, userId);
    quiz ? res.json(quiz) : res.status(404).json({ error: "Quiz not found" });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }
    console.error("Controller error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProgressHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const quizId = mongoDbIdSchema.parse(req.params.quizId);

    const { userId } = req.user || {};
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    const progress = await quizService.getQuizProgress(quizId, userId);
    res.json({ progress });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }
    console.error("Controller error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
