import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
// Update the import path to the correct location of LoginService
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class ProfessorGuard implements CanActivate {
  constructor(private router: Router, private _service: LoginService) {}

  canActivate(): Observable<boolean> {
    return this._service.fetchUserStatus().pipe(
      map(status => {
        const isProfessor = status.role === 'PROFESSOR';
        if (!isProfessor) {
          this.router.navigate(['/login']);
        }
        return isProfessor;
      }),
      catchError(() => {
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}