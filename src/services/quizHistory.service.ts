import { QuizModel, IQuiz } from "../models/quiz.model";
import { IQuizHistory } from "../interfaces/quizHIstory.types";
import mongoose, { Model } from "mongoose";
import { updateUserLastStudyDate } from "./auth.service";

export async function getTotalQuizHistory(userId: string): Promise<IQuizHistory[]> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const quizzes = await QuizModel.find({ userId }).sort({ createdAt: -1 });

  const quizHistory: IQuizHistory[] = quizzes.map((quiz: InstanceType<Model<IQuiz>>) => {
    // Calculate score: percentage of correct answers
    let correctAnswers = 0;
    quiz.answers.forEach((answer, index) => {
      if (answer && quiz.questions[index] && answer === quiz.questions[index].correct_answer) {
        correctAnswers++;
      }
    });
    const score = (correctAnswers / quiz.numberOfQuestions) * 100;
    if (correctAnswers) {
     updateUserLastStudyDate(quiz.userId);
    }
    return {
      quizId: String(quiz._id),
      subject: quiz.topic,
      date: quiz.createdAt,
      numberOfQuestions: quiz.numberOfQuestions,
      duration: quiz.duration,
      progress: quiz.progress * 100, // Convert to percentage (e.g., 0.8 to 80)
      score: parseFloat(score.toFixed(2)), // Round to 2 decimal places
    };
  });

  return quizHistory;
}

export async function getQuizHistoryById(quizId: string, userId: string): Promise<IQuizHistory | null> {
  if (!mongoose.Types.ObjectId.isValid(quizId)) {
    throw new Error("Invalid quiz ID");
  }

  const quiz = await QuizModel.findOne({ _id: quizId, userId });
  if (!quiz) {
    throw new Error("Quiz not found");
  }

  // Calculate score: percentage of correct answers
  let correctAnswers = 0;
  quiz.answers.forEach((answer, index) => {
    if (answer && quiz.questions[index] && answer === quiz.questions[index].correct_answer) {
      correctAnswers++;
    }
  });
  const score = (correctAnswers / quiz.numberOfQuestions) * 100;

  return {
    quizId: String(quiz._id),
    subject: quiz.topic,
    date: quiz.createdAt,
    numberOfQuestions: quiz.numberOfQuestions,
    duration: quiz.duration,
    progress: quiz.progress * 100, // Convert to percentage (e.g., 0.8 to 80)
    score: parseFloat(score.toFixed(2)), // Round to 2 decimal places
  };
}