import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Professor, ProfessorStatus } from 'src/app/models/professor';
import { ProfessorService } from 'src/app/services/professor.service';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-approvalstatus',
  templateUrl: './approvalstatus.component.html',
  styleUrls: ['./approvalstatus.component.css']
})
export class ApprovalstatusComponent implements OnInit {
  userDetails: { email: string; role: string; accessType: string; currentLevel: string } | null = null;
  isLoggedIn: boolean = false;
  errorMessage: string = '';
  approval: Observable<Professor[]> | undefined;
  professorlist: Observable<Professor[]> | undefined;
  responses: Observable<any> | undefined;
  ProfessorStatus = ProfessorStatus;
  showAdminApproval: boolean = false;
  showProfessorApproval: boolean = false;

  constructor(
    private _service: ProfessorService,
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loginService.getUserStatus().subscribe({
      next: (status) => {
        this.userDetails = status;
        this.isLoggedIn = !!status && !!status.email;
        this.cdr.detectChanges();
        if (!this.isLoggedIn || (status?.role !== 'ADMIN' && status?.role !== 'PROFESSOR')) {
          setTimeout(() => this.router.navigate(['/forbidden']), 0);
          return;
        }
        this.showAdminApproval = status?.role === 'ADMIN';
        this.showProfessorApproval = status?.role === 'PROFESSOR';
        this.loadProfessorData();
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
        setTimeout(() => this.router.navigate(['/login']), 0);
      }
    });
  }

  private loadProfessorData(): void {
    if (!this.userDetails?.email) return;
    this.professorlist = this._service.getProfessorList();
    this.approval = this._service.getProfessorListByEmail(this.userDetails.email);
    this.cdr.detectChanges();
  }

  acceptRequest(curremail: string): void {
    this._service.acceptRequestForProfessorApproval(curremail).subscribe({
      next: () => {
        this.professorlist = this._service.getProfessorList();
        this.snackBar.open('✅ Request accepted!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Accept request failed.';
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

  rejectRequest(curremail: string): void {
    this._service.rejectRequestForProfessorApproval(curremail).subscribe({
      next: () => {
        this.professorlist = this._service.getProfessorList();
        this.snackBar.open('✅ Request rejected!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Reject request failed.';
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