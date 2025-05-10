export interface IQuizHistory {
    quizId: string;
    subject: string;
    date: Date;
    numberOfQuestions: number;
    duration?: number; 
    progress: number; 
    score: number; 
  }