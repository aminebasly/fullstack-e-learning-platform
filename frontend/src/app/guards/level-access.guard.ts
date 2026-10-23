import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { ModalService } from '../services/modal.service';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class LevelAccessGuard implements CanActivate {

  constructor(
    private userService: UserService,
    private router: Router,
    private modalService: ModalService,
    private loginService: LoginService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const targetLevel = route.params['level'];

    if (!targetLevel) {
      this.router.navigate(['/login']);
      return of(false);
    }

    return this.loginService.fetchUserStatus().pipe(
      switchMap(status => {
        if (!status?.email) {
          this.router.navigate(['/login']);
          return of(false);
        }
        return this.userService.getUserProfile(status.email).pipe(
          map(user => {
            if (!user || !user.accessType || !user.currentLevel) {
              this.router.navigate(['/login']);
              return false;
            }

            const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
            const userIndex = levels.indexOf(user.currentLevel);
            const targetIndex = levels.indexOf(targetLevel);

            if (user.accessType === 'Full') {
              return targetIndex <= userIndex + 1;
            }

            if (user.accessType === 'Single' && user.purchasedLevel === targetLevel) {
              return true;
            }

            this.modalService.triggerModal(targetLevel);
            return false;
          })
        );
      }),
      catchError(() => {
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
