import mongoose, { Schema, Document } from 'mongoose';


export interface IQuizQuestion {
  question: string;
  options?: string[];
  correct_answer: string;
}

export interface IQuiz extends Document {
  userId: string;
  topic: string;
  academicLevel: 'secondary' | 'university' | 'personal development';
  difficulty: 'easy' | 'medium' | 'hard';
  numberOfQuestions: number;
  duration?: number;
  questions: IQuizQuestion[];
  answers: (string | null)[];
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

const QuizSchema: Schema<IQuiz> = new Schema({
  userId: { type: String, required: true },
  topic: { type: String, required: true },
  academicLevel: { type: String, enum: ['secondary', 'university', 'personal development'], required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  numberOfQuestions: { type: Number, required: true },
  duration: { type: Number },
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String }],
    correct_answer: { type: String, required: true }
  }],
  answers: [{ type: String, default: null }],
  progress: { type: Number, default: 0 },
}, { timestamps: true });

export const QuizModel = mongoose.model<IQuiz>('Quiz', QuizSchema);
