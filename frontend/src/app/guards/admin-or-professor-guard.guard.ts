import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LoginService } from '../services/login.service'; // Adjust path as needed

@Injectable({
  providedIn: 'root'
})
export class AdminOrProfessorGuard implements CanActivate {
  constructor(private _service: LoginService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this._service.fetchUserStatus().pipe(
      map(status => {
        const isAllowed = status.role === 'ADMIN' || status.role === 'PROFESSOR';
        if (!isAllowed) {
          this.router.navigate(['/forbidden']);
        }
        return isAllowed;
      }),
      catchError(() => {
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}