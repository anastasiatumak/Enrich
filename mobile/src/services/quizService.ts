import { api } from './api';

export interface Flashcard {
  id: number;
  word: string;
  translation?: string;
  transcription?: string;
  meaning?: string;
  partOfSpeech?: string;
  example?: string;
  difficultyLevel?: string;
  isSaved: boolean;
  isPersonal: boolean;
}

export interface QuizAnswer {
  flashcardId: number;
  isKnown: boolean;
}

export interface QuizResult {
  startedAt: string;
  finishedAt: string;
  answers: QuizAnswer[];
}

export interface QuizAttempt {
  id: number;
  startedAt: string;
  finishedAt: string;
  scorePercentage: number;
}

export const quizService = {
  generateQuiz: async (count: number = 10): Promise<Flashcard[]> => {
    const response = await api.get<Flashcard[]>(`Quiz/generate?count=${count}`);
    return response.data;
  },

  submitResult: async (result: QuizResult): Promise<QuizAttempt> => {
    const response = await api.post<QuizAttempt>('Quiz/submit', result);
    return response.data;
  },

  getHistory: async (): Promise<QuizAttempt[]> => {
    const response = await api.get<QuizAttempt[]>('Quiz/history');
    return response.data;
  },
};
