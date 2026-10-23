import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserProgress } from '../models/contents';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const NAV_URL = environment.apiUrl;

;

@Injectable({
  providedIn: 'root'
})
export class UserProgressService {

  constructor(private http: HttpClient) {}

  getProgress(email: string): Observable<UserProgress[]> {
    return this.http.get<UserProgress[]>(`${NAV_URL}/user/progress/${email}`);
  }

  getProgressSummary(email: string): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${NAV_URL}/user/content/progress-summary/${email}`);
  }

  getCompletedContentCount(email: string): Observable<number> {
    const params = new HttpParams().set('email', email);
    return this.http.get<number>(`${NAV_URL}/user/content/completed-count`, { params });
  }

  getTotalCompletedContent(): Observable<number> {
  return this.http.get<number>(`${NAV_URL}/user/content/total-completed-content`);
}

}
