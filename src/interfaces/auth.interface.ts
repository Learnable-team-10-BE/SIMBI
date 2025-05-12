import { Document } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  levelOfEducation: 'secondary' | 'university';
  privateKey: string | null | undefined;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate?: Date;
  lastQuizDate?: Date;
    walletAddress: string | null | undefined;
  achievements?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EncryptedData {
  iv: string;
  encryptedData: string;
}

export interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  levelOfEducation: 'secondary' | 'university';
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface IQuiz extends Document {
  userId: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: 'short' | 'medium' | 'long';
  questions: QuizQuestion[];
  answers: string[];
  status: 'in_progress' | 'completed';
  createdAt: Date;
}

export interface IReward extends Document {
  userId: string;
  quizId: string;
  tokensEarned: number;
  streakBonus: number;
  achievementsUnlocked: string[];
  createdAt: Date;
}