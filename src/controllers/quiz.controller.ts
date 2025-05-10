import { Request, Response } from "express";
import { IQuizInput } from "../interfaces/quiz.types";
import * as quizService from "../services/quiz.service";
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

export const submitAnswerHandler = async (req: AuthenticatedRequest, res: Response):Promise<void> => {
  try {
    const { userId, quizId } = req.params;
    const { questionIndex, answer } = req.body;
    const quiz = await quizService.submitAnswer(userId, quizId, questionIndex, answer);
    res.status(200).json({ progress: quiz.progress });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getQuizHandler = async (req: AuthenticatedRequest, res: Response) => {
  const quiz = await quizService.getQuizById(req.params.quizId);
  quiz ? res.json(quiz) : res.status(404).json({ error: 'Quiz not found' });
};

export const getProgressHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const progress = await quizService.getQuizProgress(req.params.quizId, req.params.userId);
    res.json({ progress });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};