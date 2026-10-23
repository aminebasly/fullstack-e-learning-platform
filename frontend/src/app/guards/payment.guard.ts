import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaymentGuard implements CanActivate {

  constructor(private router: Router, private loginService: LoginService) {}

  canActivate(): Observable<boolean> {
    return this.loginService.fetchUserStatus().pipe(
      map(status => {
        if (status.accessType === 'Full' || status.accessType === 'Single') {
          return true;
        } else {
          this.router.navigate(['/payment']);
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/payment']);
        return of(false);
      })
    );
  }
}
