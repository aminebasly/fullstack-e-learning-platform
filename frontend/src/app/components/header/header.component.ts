import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userDetails: { email: string; role: string; accessType: string; currentLevel: string } | null = null;
  isLoggedIn: boolean = false;
  title: string = '';
  errorMessage: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loginService.getUserStatus().subscribe({
      next: (status) => {
        console.log('User status:', status);
        this.userDetails = status;
        this.isLoggedIn = !!status && !!status.email;
        this.cdr.detectChanges();
        if (!this.isLoggedIn) {
          setTimeout(() => this.router.navigate(['/login']), 0);
          return;
        }
        this.setTitle();
      },
      error: (err) => {
        console.error('Error fetching user status:', err);
        this.errorMessage = 'Failed to load user details.';
        this.snackBar.open(this.errorMessage, 'Close', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/login']), 0);
      }
    });
  }
  navigateToLogin() {
this.router.navigate(['/login']);
}

  private setTitle(): void {
    if (this.userDetails?.email === 'admin@gmail.com') {
      this.title = 'Admin Dashboard';
    } else if (this.userDetails?.role === 'PROFESSOR') {
      this.title = 'Professor Dashboard';
    } else if (this.userDetails?.role === 'USER') {
      this.title = 'User Dashboard';
    }
    this.cdr.detectChanges();
  }

  logout(): void {
    console.log('Initiating logout...');
    this.loginService.logout().subscribe({
      next: () => {
        console.log('Logout successful');
        this.isLoggedIn = false;
        this.userDetails = null;
        this.title = '';
        this.cdr.detectChanges();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
        this.errorMessage = 'Logout failed.';
        this.snackBar.open(this.errorMessage, 'Close', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        this.cdr.detectChanges();
      }
    });
  }

  navigateHome(): void {
    if (this.userDetails?.email === 'admin@gmail.com') {
      this.router.navigate(['/admindashboard']);
    } else if (this.userDetails?.role === 'PROFESSOR') {
      this.router.navigate(['/professordashboard']);
    } else if (this.userDetails?.role === 'USER') {
      this.router.navigate(['/userdashboard']);
    } else {
      this.router.navigate(['/login']);
    }
    this.cdr.detectChanges();
  }
}