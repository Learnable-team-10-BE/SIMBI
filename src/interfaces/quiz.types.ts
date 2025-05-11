export interface IQuizInput {
  topic?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  academicLevel: 'secondary school' | 'university' | 'personal development';
  numberOfQuestions: number;
  duration?: number;
  file?: Express.Multer.File; 
}

export interface IMCQQuestion {
  question: string;
  options: string[];
  correct_answer: string;
}

export interface IShortAnswerQuestion {
  question: string;
  correct_answer: string;
}

export interface ITrueFalseQuestion {
  question: string;
  correct_answer: 'True' | 'False';
}

export type QuizQuestion = IMCQQuestion | IShortAnswerQuestion | ITrueFalseQuestion;