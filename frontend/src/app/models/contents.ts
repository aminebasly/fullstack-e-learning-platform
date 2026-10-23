// models.ts

import { User } from "./user";

export interface Content {
    id: number;
    type: string; // "VIDEO", "LISTENING", "GRAMMAR"
    url: string; // Media URL or text for grammar
    level: string; // e.g., "A1"
    unitNumber: number; // 1, 2, or 3
    contentNumber: number; // 1, 2, or 3 within unit
    questions: Question[];
    grammarHtml: string;
    pdfUrl:string; // HTML content for grammar (optional)
  }
  
  export interface Payment {
    id: number;
    user: User;
    transactionId: string; // PayPal transaction ID
    accessType: string; // "FULL" or "SINGLE"
    level: string | null; // e.g., "A1" (null for full access)
    amount: number;
    status: string; // "COMPLETED", "PENDING", "FAILED"
    createdAt: string; // ISO date string
  }
  
  export interface Question {
    id: number;
    text: string; // e.g., "What is the main idea of the video?"
    type: string; // e.g., "MULTIPLE_CHOICE", "TRUE_FALSE"
    options: string[]; // e.g., ["Option A", "Option B"]
    correctOption: number; // Index of correct option
  }
  
  export interface QuizAttempt {
    id: number;
    user: User;
    quizType: string; // "PLACEMENT" or level (e.g., "A1")
    score: number; // Percentage (0-100)
    attemptedAt: string; // ISO date string
  }
  
  export interface UserProgress {
    id: number;
    user: User;
    content: Content;
    completed: boolean;
    score: number | null; // Score from questions (if applicable)
    completedAt: string | null; // ISO date string
  }

export interface UnitProgress {
  id?: number; // Optional since it may not be needed on frontend
  unitNumber: number;
  completedContentCount: number;
  totalContentCount: number;
  level: string;
}

export interface ContentWithStatus {
  id: number;
  type: string;
  url: string;
  level: string;
  unitNumber: number;
  contentNumber: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED';
}


  
 