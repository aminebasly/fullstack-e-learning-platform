import { Injectable } from '@angular/core';

import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class QuizGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const quizCompleted = sessionStorage.getItem('quizCompleted') === 'true';

    if (quizCompleted) {
      // Redirect to userdashboard immediately and prevent rendering QcmTestComponent
      this.router.navigate(['/userdashboard'], { replaceUrl: true });
      return false; // Block access to QcmTest
    }

    return true; // Allow access to QcmTest
  }
}