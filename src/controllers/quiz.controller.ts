import { Request, Response } from "express";
import mongoose from "mongoose";
import { IQuizInput } from "../interfaces/quiz.types";
import * as quizService from "../services/quiz.service";
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
import authMiddleware, { AuthenticatedRequest } from "../middlewares/auth.middleware";

export const createQuizHandler = async (req: AuthenticatedRequest, res: Response):Promise<void> => {
  try {
    
    const userId = req.user!.userId; 
    const input: IQuizInput = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
    }

    const quiz = await quizService.createQuiz(userId, input);
    res.status(201).json(quiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
};
export const generateQuizHandler = [
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      const input: IQuizInput = req.body;
      if (req.file) {
        input.file = req.file;
      }
      const quiz = await quizService.createQuiz(req.body.userId, input);
      res.status(200).json({ success: true, data: quiz }); // Return full quiz object
    } catch (error: any) {
      console.error("Controller error:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  }
];

export const submitAnswerHandler = async (req: AuthenticatedRequest, res: Response):Promise<void> => {
  try {
    const { userId, quizId } = req.params;
    const { questionIndex, answer } = req.body;

    // Debug the quizId
    console.log("Received quizId:", quizId);

    // Validate quizId
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      res.status(400).json({ error: "Invalid quizId format" });
    }

    const quiz = await quizService.submitAnswer(userId, quizId, questionIndex, answer);
    res.status(200).json({ progress: quiz.progress });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getQuizHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { quizId } = req.params;

    // Debug the quizId
    console.log("Received quizId for getQuiz:", quizId);

    // Validate quizId
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      res.status(400).json({ error: "Invalid quizId format" });
    }

    const quiz = await quizService.getQuizById(quizId);

    if (quiz) {
      res.json(quiz);
    } else {
      res.status(404).json({ error: "Quiz not found" });
    }
  } catch (error: any) {
    console.error("Error fetching quiz:", error.message);
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
}

export const getProgressHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { quizId, userId } = req.params;

    // Debug the quizId
    console.log("Received quizId for getProgress:", quizId);

    // Validate quizId
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({ error: "Invalid quizId format" });
    }

    const progress = await quizService.getQuizProgress(quizId, userId);
    res.json({ progress });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
}