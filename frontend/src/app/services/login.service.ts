import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Professor } from '../models/professor';
import { User } from '../models/user';

const NAV_URL = environment.apiUrl;

;

@Injectable({
  providedIn: 'root'
})
export class LoginService {
 private userStatus = new BehaviorSubject<{
  email: string;
  role: string;
  accessType: string;
  currentLevel: string;
  username: string;
  gender: string;
} | null>(null);


  constructor(private _http: HttpClient) {}

  // Get cached user status
  getUserStatus(): Observable<{ email: string; role: string; accessType: string; currentLevel: string;gender:string } | null> {
    return this.userStatus.asObservable();
  }

  // Fetch user status from backend and cache it
 fetchUserStatus(): Observable<{
  email: string;
  role: string;
  accessType: string;
  currentLevel: string;
  username: string;
  gender: string;
}> {
  return this._http.get<{
    email: string;
    role: string;
    accessType: string;
    currentLevel: string;
    username: string;
    gender: string;
  }>(`${NAV_URL}/auth/status`, { withCredentials: true }).pipe(
    tap(status => this.userStatus.next(status)),
    catchError(error => {
      this.userStatus.next(null);
      return this.handleError(error);
    })
  );
}


  // Check if user is logged in (suitable for HTTP-only cookies)
  isUserLoggedIn(): Observable<boolean> {
    return this.userStatus.pipe(
      map(status => !!status && !!status.email),
      catchError(() => of(false))
    );
  }

  loginUserFromRemote(user: User): Observable<User> {
    return this._http.post<User>(`${NAV_URL}/loginuser`, user, { withCredentials: true }).pipe(
      tap(() => console.log('User login success')),
      catchError(this.handleError)
    );
  }

  loginProfessorFromRemote(professor: Professor): Observable<Professor> {
    return this._http.post<Professor>(`${NAV_URL}/loginprofessor`, professor, { withCredentials: true }).pipe(
      tap(() => console.log('Professor login success')),
      catchError(this.handleError)
    );
  }

  loginAdmin(email: string, password: string): Observable<any> {
    return this._http.post<any>(`${NAV_URL}/loginadmin`, { email, password }, { withCredentials: true });
  }

  logout(): Observable<any> {
    return this._http.post(`${NAV_URL}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => this.userStatus.next(null)), // Clear cached user status
      catchError(this.handleError)
    );
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this._http.post<{ message: string }>(`${NAV_URL}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this._http.post(`${NAV_URL}/reset-password`, { token, newPassword });
  }

  private handleError(error: HttpErrorResponse) {
    const errorMsg = error.error?.message || 'Something went wrong during authentication.';
    console.error('LoginService Error:', error);
    return throwError(() => new Error(errorMsg));
  }
}