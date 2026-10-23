import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(private router: Router, private _service: LoginService) {}

  canActivate(): Observable<boolean> {
    return this._service.fetchUserStatus().pipe(
      map(status => {
        const isValid =
          status.role === 'USER' &&
          (status.accessType === 'Full' || status.accessType === 'Single') &&
          !!status.currentLevel;

        if (!isValid) {
          this.router.navigate(['/login']);
        }

        return isValid;
      }),
      catchError(err => {
        console.warn('UserGuard error or not logged in:', err);
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
