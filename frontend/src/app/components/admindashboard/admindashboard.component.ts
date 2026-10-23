import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AdminService } from 'src/app/services/admin.service';
import { LoginService } from 'src/app/services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserProgressService } from 'src/app/services/user-progress.service';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css']
})
export class AdmindashboardComponent implements OnInit {
  userDetails: { email: string; role: string; accessType: string; currentLevel: string } | null = null;
  isLoggedIn: boolean = false;
  errorMessage: string = '';
  professors: Observable<any[]> | undefined;
  users: Observable<any[]> | undefined;
  courses: Observable<any[]> | undefined;
  enrollments: Observable<any[]> | undefined;
  enrollmentcount: Observable<any[]> | undefined;
  wishlist: Observable<any[]> | undefined;
  chapters: Observable<any[]> | undefined;
  isSidebarOpen: boolean = false;
  totalUsers: number = 0;
  totalCompletedContent: number = 0;
 professorsCount: number = 0;

  constructor(
    private _route: Router,
    private _service: AdminService,
    private _uerprogressService: UserProgressService,
    private loginService: LoginService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

public pieChartData: ChartData<'doughnut', number[], string | string[]> = {
  labels: ['Full Access Male', 'Full Access Female', 'Single Access Male', 'Single Access Female'],
  datasets: [{
    data: [0, 0, 0, 0],
    backgroundColor: ['#6a0dad', '#ff69b4', '#ff7e5f', '#28a745'],
    borderColor: '#fff',
    borderWidth: 2,
    hoverBackgroundColor: ['#6a0dad', '#ff69b4', '#ff7e5f', '#28a745'], // Same as backgroundColor to prevent color change
    hoverOffset: 0 // Prevents segments from popping out
  }]
};

public pieChartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { color: '#333', font: { size: 14, weight: 'bold' } }
    },
    tooltip: { enabled: true } // Tooltips remain enabled
  },
  cutout: '60%',
  rotation: -90,
  circumference: 180,
  animation: {
    animateRotate: true,
    animateScale: true
  },
  // Ensure hover does not trigger visual changes
  hover: {
    mode: undefined // Disables hover interactions for visual changes
  },
  interaction: {
    mode: 'nearest', // Still allows tooltips
    intersect: true
  }
};




  ngOnInit(): void {
    this.loginService.getUserStatus().subscribe({
      next: (status) => {
        this.userDetails = status;
        this.isLoggedIn = !!status && !!status.email;
        this.cdr.detectChanges();
        if (!this.isLoggedIn || status?.role !== 'ADMIN') {
          setTimeout(() => this._route.navigate(['/forbidden']), 0);
          return;
        }
        this.loadAdminData();
      },
      error: () => {
        this.errorMessage = 'Failed to load user details.';
        this.snackBar.open(this.errorMessage, 'Close', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        this.cdr.detectChanges();
        setTimeout(() => this._route.navigate(['/login']), 0);
      }
    });
  }

 

  private loadAdminData(): void {

this._service.getUsersAccessGender().subscribe({
  next: (data) => {
    this.pieChartData = {
      labels: ['Full Access Male', 'Full Access Female', 'Single Access Male', 'Single Access Female'],
      datasets: [{
        data: [
          Number(data.fullAccess.male),
          Number(data.fullAccess.female),
          Number(data.singleAccess.male),
          Number(data.singleAccess.female)
        ],
        backgroundColor: ['#6a0dad', '#ff69b4', '#ff7e5f', '#28a745'],
        borderColor: '#fff',
        borderWidth: 2,
        hoverOffset: 20 // nice hover effect
      }]
    };
  },
  error: (err) => console.error('Failed to fetch users access by gender', err)
});

   this._service.getTotalProfessors()?.subscribe({
    next: (professors: any[] | number) => {
      // Convert to number explicitly
      this.professorsCount = Array.isArray(professors) ? professors.length : Number(professors);
    },
    error: (err) => {
      console.error('Failed to fetch professors:', err);
      this.professorsCount = 0;
    }
  });
    this._service.getTotalUsers()?.subscribe({
      next: (data: number) => {
        this.totalUsers = data;
      },
      error: (err) => {
        console.error('Failed to fetch total users:', err);
      }
    });
      this._uerprogressService.getTotalCompletedContent()?.subscribe({
    next: (data: number) => {
      this.totalCompletedContent = data;
    },
    error: (err) => {
      console.error('Failed to fetch completed content:', err);
      this.totalCompletedContent = 0;
    }
  });
    
    
  }
  

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.cdr.detectChanges();
  }

  logout(): void {
    this.loginService.logout().subscribe({
      next: () => {
        this.isLoggedIn = false;
        this.userDetails = null;
        this.cdr.detectChanges();
        this._route.navigate(['/login']);
      },
      error: () => {
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
}
