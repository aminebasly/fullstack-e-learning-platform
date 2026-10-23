import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../services/login.service';
import { Observable, of } from 'rxjs';
import { map, catchError, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContentAccessGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const isPreview = route.queryParamMap.get('preview') === 'true';

    return this.loginService.getUserStatus().pipe(
      take(1),  // Only take first emission
      map(status => {
        if (!status) {
          this.router.navigate(['/login']);
          return false;
        }

        if (status.role === 'USER') {
          return true; // Allow users
        }

        if ((status.role === 'ADMIN' || status.role === 'PROFESSOR') && isPreview) {
          return true; // Allow Admin/Professor in preview
        }

        this.router.navigate(['/forbidden']);
        return false;
      }),
      catchError(() => {
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
