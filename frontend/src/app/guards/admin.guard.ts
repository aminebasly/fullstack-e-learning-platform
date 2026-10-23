import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LoginService } from '../services/login.service'; // Adjust path as needed

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private _service: LoginService) {}

  canActivate(): Observable<boolean> {
    return this._service.fetchUserStatus().pipe(
      map(status => {
        const isAdmin = status.role === 'ADMIN';
        if (!isAdmin) {
          this.router.navigate(['/login']);
        }
        return isAdmin;
      }),
      catchError(() => {
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}