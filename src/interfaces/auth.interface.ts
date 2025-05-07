import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  verificationToken?: string;
  isVerified: boolean;
  walletAddress: string;
  privateKey: string;
  levelOfEducation: 'secondary' | 'university';
  currentStreak: number;
  longestStreak: number;
  lastStudyDate?: Date;
  lastQuizDate?: Date;
  achievements: string[];
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

export interface VerifyRequestBody {
  email: string;
  verificationToken: string;
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