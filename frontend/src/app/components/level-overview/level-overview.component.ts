import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProgressService } from '../../services/progress.service';
import { UserService } from '../../services/user.service';
import { LoginService } from '../../services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UnitProgress, Content } from '../../models/contents';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-level-overview',
  templateUrl: './level-overview.component.html',
  styleUrls: ['./level-overview.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('0.4s {{delay}} ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ], { params: { delay: '0s' } })
    ])
  ]
})
export class LevelOverviewComponent implements OnInit {
  unitProgressList: UnitProgress[] = [];
  nextContent: Content | null = null;
  lastContentVisited: Content | null = null;
  userDetails: { email: string; role: string; accessType: string; currentLevel: string } | null = null;
  isLoggedIn: boolean = false;
  currentLevel: string = '';
  errorMessage: string = '';

  constructor(
    private progressService: ProgressService,
    private userService: UserService,
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef // Add ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loginService.getUserStatus().subscribe({
      next: (status) => {
        this.userDetails = status;
        this.isLoggedIn = !!status && !!status.email;
        this.cdr.detectChanges(); // Trigger change detection
        if (!this.isLoggedIn || status?.role !== 'USER') {
          setTimeout(() => this.router.navigate(['/forbidden']), 0); // Defer navigation
          return;
        }
        this.loadUserData();
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

  private loadUserData(): void {
    this.route.paramMap.subscribe(params => {
      this.currentLevel = params.get('level') || '';
      console.log('Current Level from route:', this.currentLevel);
      console.log('Email from LoginService:', this.userDetails?.email);

      if (this.userDetails?.email) {
        this.loadUnitProgress();
        this.loadLastContentVisited();
      } else {
        this.snackBar.open('❌ Please log in to continue.', 'Close', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        setTimeout(() => this.router.navigate(['/login']), 0);
        this.cdr.detectChanges();
      }
    });
  }

  loadUnitProgress(): void {
    if (!this.userDetails?.email) return;
    this.progressService.getUnitProgress(this.userDetails.email, this.currentLevel).subscribe({
      next: (progress) => {
        this.unitProgressList = progress || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load unit progress.';
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

  loadLastContentVisited(): void {
    if (!this.userDetails?.email) return;
    this.userService.getLastContentVisited(this.userDetails.email).subscribe({
      next: (content) => {
        this.lastContentVisited = content || null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load last content visited.';
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

  getUnitStatus(unit: UnitProgress): string {
    if (unit.completedContentCount === 0) return 'Not Started';
    if (unit.completedContentCount === unit.totalContentCount) return 'Completed';
    return 'In Progress';
  }

  getProgressPercent(unit: UnitProgress): number {
    const completed = unit.completedContentCount || 0;
    const total = unit.totalContentCount || 0;
    if (total === 0) return 0;
    console.log('Current progress', Math.round((completed / total) * 100));
    return Math.round((completed / total) * 100);
  }

  resumeContent(): void {
    if (this.lastContentVisited && this.lastContentVisited.level === this.currentLevel) {
      this.router.navigate(['/content/play', this.lastContentVisited.id]);
    } else if (this.nextContent?.id) {
      this.router.navigate(['/content/play', this.nextContent.id]);
    } else {
      this.router.navigate([`/level/${this.currentLevel}/unit`, 1]);
    }
  }

  goToUnit(unitNumber: number): void {
    this.router.navigate([`/level/${this.currentLevel}/unit`, unitNumber]);
  }

  isAllUnitsNotStarted(): boolean {
    return this.unitProgressList.every(unit => unit.completedContentCount === 0);
  }
}