import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { QuizAttempt } from '../models/contents';
import { environment } from 'src/environments/environment';
const NAV_URL = environment.apiUrl

;

@Injectable({
  providedIn: 'root'
})
export class QuizAttemptService {

  constructor(private http: HttpClient) {}

  getQuizAttempts(email: string): Observable<QuizAttempt[]> {
    return this.http.get<QuizAttempt[]>(`${NAV_URL}/user/quiz-attempts/${email}`);
  }

  createQuestion(question: any) {
  return this.http.post(`${NAV_URL}/api/admin/quiz/create`, question);
}

createQuestions(questions: any[]) {
  return this.http.post(`${NAV_URL}/api/admin/quiz/bulk`, questions);
}

getAllQuestions() {
  return this.http.get(`${NAV_URL}/api/admin/quiz/all`);
}



getQuestionsByType(quizType: string): Observable<any[]> {
  return this.http.get<any[]>(`${NAV_URL}/quiz/${quizType}`);
}

submitAttempt(quizAttempt: { quizType: string; score: number; email: string }): Observable<any> {
  return this.http.post(`${NAV_URL}/quiz-attempt`, quizAttempt);
}

}
