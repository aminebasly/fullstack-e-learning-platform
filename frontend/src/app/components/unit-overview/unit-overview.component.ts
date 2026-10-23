import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { LoginService } from '../../services/login.service';
import { ContentWithStatus } from '../../models/contents';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-unit-overview',
  templateUrl: './unit-overview.component.html',
  styleUrls: ['./unit-overview.component.css']
})
export class UnitOverviewComponent implements OnInit {
  level: string = '';
  unitNumber: number = 0;
  contentList: ContentWithStatus[] = [];
  userDetails: { email: string; role: string; accessType: string; currentLevel: string } | null = null;
  isLoggedIn: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contentService: ContentService,
    private loginService: LoginService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loginService.getUserStatus().subscribe({
      next: (status) => {
        this.userDetails = status;
        this.isLoggedIn = !!status && !!status.email;
        this.cdr.detectChanges();
        if (!this.isLoggedIn || status?.role !== 'USER') {
          setTimeout(() => this.router.navigate(['/forbidden']), 0);
          return;
        }
        this.loadUnitData();
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

  private loadUnitData(): void {
    this.route.paramMap.subscribe(params => {
      this.level = params.get('level') || '';
      this.unitNumber = Number(params.get('unitNumber'));
      if (this.userDetails?.email && this.level && this.unitNumber) {
        this.loadContent();
      } else {
        this.errorMessage = 'Invalid parameters or user not logged in.';
        this.snackBar.open(this.errorMessage, 'Close', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/login']), 0);
      }
      this.cdr.detectChanges();
    });
  }

  goBackToUnits(): void {
    if (this.level) {
      this.router.navigate(['/level-overview', this.level]);
      this.cdr.detectChanges();
    }
  }

  loadContent(): void {
    if (!this.userDetails?.email) return;
    this.contentService.getContentWithStatus(this.userDetails.email, this.level, this.unitNumber).subscribe({
      next: (data) => {
        this.contentList = data.sort((a, b) => {
          if (a.type === b.type) {
            return a.contentNumber - b.contentNumber;
          }
          return a.type.localeCompare(b.type);
        });
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load unit content.';
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

  goToContent(contentId: number): void {
    this.router.navigate(['/content/play', contentId]);
    this.cdr.detectChanges();
  }

  getDisplayType(type: string): string {
    switch (type) {
      case 'VIDEO': return 'Video';
      case 'LISTENING': return 'Listening';
      case 'GRAMMAR': return 'Grammar';
      default: return type;
    }
  }

  getStatusEmoji(status: string): string {
    switch (status) {
      case 'COMPLETED': return '✅';
      case 'IN_PROGRESS': return '⏳';
      case 'NOT_STARTED': return '❌';
      default: return '';
    }
  }
}