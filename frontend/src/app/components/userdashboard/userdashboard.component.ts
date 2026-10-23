import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AdminService } from 'src/app/services/admin.service';
import { UserService } from 'src/app/services/user.service';
import { Router, NavigationEnd } from '@angular/router';
import { User } from '../../models/user';
import { UserProgressService } from 'src/app/services/user-progress.service';
import { QuizAttemptService } from 'src/app/services/quiz-attempt.service';
import { Content, QuizAttempt } from 'src/app/models/contents';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css']
})
export class UserdashboardComponent implements OnInit, OnDestroy {
  loggedUser = '';
  username = '';
  currRole = '';
  currentLevel = '';
  email = '';

  user: User = new User();
  units: { completed: boolean }[] = [];
  completedUnits: number = 0;
  progressPercentage: number = 0;
  totalCompletedContent: number = 0;
  isSidebarOpen = false;

  routerSubscription?: Subscription;

  // Data sets
  courses?: Observable<any[]>;
  enrollments?: Observable<any[]>;
  enrollmentcount?: Observable<any[]>;
  wishlist?: Observable<any[]>;
  chapters?: Observable<any[]>;

  userProgress: any[] = [];
  availableLevels: string[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  progressSummary: { [key: string]: number } = {};
  quizAttempts: QuizAttempt[] = [];
  levelAccess: { [key: string]: boolean } = {};
  levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  lastContentVisited: Content | null = null;
  nextContent: Content | null = null;

  constructor(
    private _adminService: AdminService,
    private _userService: UserService,
    private userProgressService: UserProgressService,
    private quizAttemptService: QuizAttemptService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url === '/userdashboard') {
        this.loadUserProgress();
      }
    });

    // Securely get user info from backend (not sessionStorage)
    this.loginService.fetchUserStatus().subscribe({
      next: (status) => {
        this.loggedUser = status.email;
        this.email = status.email;
        this.username = status.username;
        this.currRole = status.role;
        this.currentLevel = status.currentLevel;

        this.loadUserProgress();
        this.loadDashboardData();
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });

    // Sidebar toggle buttons
    const btn = document.getElementById('btn');
    const sidebar = document.querySelector('.sidebar');
    if (btn && sidebar) {
      btn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        this.menuBtnChange(btn);
      });
    }

    const searchIcon = document.querySelector('.bx-search');
    if (searchIcon && sidebar && btn) {
      searchIcon.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        this.menuBtnChange(btn);
      });
    }
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.classList.toggle('open', this.isSidebarOpen);
  }

  menuBtnChange(btn: HTMLElement): void {
    btn.classList.toggle('fa-bars', !this.isSidebarOpen);
    btn.classList.toggle('fa-ellipsis-v', this.isSidebarOpen);
  }

  loadUserProgress(): void {
    if (!this.loggedUser || this.loggedUser === 'Guest') {
      this.router.navigate(['/login']);
      return;
    }

    this._userService.getProfileDetails(this.loggedUser)
      .pipe(tap(data => console.log('Data received from service:', data)))
      .subscribe({
        next: (userData: User) => {
          this.user = userData;
          this.currentLevel = this.user.currentLevel || 'N/A';

          if (this.user.badges) {
            const badgesArray = this.user.badges.split(',');
            this.completedUnits = badgesArray
              .filter(badge => badge.startsWith('Unit') && badge.includes(this.currentLevel))
              .length;
          } else {
            this.completedUnits = 0;
          }

          this.units = [
            { completed: this.completedUnits > 0 },
            { completed: this.completedUnits > 1 },
            { completed: this.completedUnits > 2 }
          ];

          this.progressPercentage = (this.completedUnits / 3) * 100;

          this.courses = this._adminService.getTotalCourses();
          this.enrollments = this._adminService.getTotalEnrollments();
          this.enrollmentcount = this._adminService.getTotalEnrollmentCount();
          this.wishlist = this._adminService.getTotalWishlist();
          this.chapters = this._adminService.getTotalChapters();

          this.cdr.detectChanges();
        },
        error: () => this.router.navigate(['/login'])
      });
  }

  loadDashboardData(): void {
    forkJoin([
      this._userService.getUserProfile(this.email),
      this.userProgressService.getProgressSummary(this.email),
      this.quizAttemptService.getQuizAttempts(this.email),
      this._userService.getLevelAccess(this.email),
      this.userProgressService.getCompletedContentCount(this.email)
    ]).subscribe({
      next: ([user, progressSummary, quizAttempts, levelAccess, completedCount]) => {
        this.user = user;
        this.progressSummary = progressSummary;
        this.quizAttempts = quizAttempts;
        this.levelAccess = levelAccess;
        this.totalCompletedContent = completedCount;
        this.cdr.detectChanges();
      },
      error: () => {
        this.snackBar.open('Failed to load dashboard data', 'Close', { duration: 3000 });
      }
    });
  }

  navigateToContent(level: string): void {
    this.router.navigate(['/level-overview', level]);
  }

  

  navigateToQuiz(level: string): void {
    if (this.currentLevel.toUpperCase() !== level.toUpperCase()) {
      this.snackBar.open(
        `You can only take the quiz for your current level: ${this.currentLevel}.`,
        'Close',
        { duration: 4000, panelClass: ['error-snackbar'], horizontalPosition: 'center', verticalPosition: 'top' }
      );
      return;
    }

    

    if (this.hasAlreadyAttempted(level)) {
      this.snackBar.open(
        `You have already completed the ${level} quiz.`,
        'Close',
        { duration: 4000, panelClass: ['warning-snackbar'], horizontalPosition: 'center', verticalPosition: 'top' }
      );
      return;
    }

    if (this.canTakeQuiz(level)) {
      this.router.navigate(['/quiz', level]);
    } else {
      this.snackBar.open(
        'Complete all content for this level to take the quiz.',
        'Close',
        { duration: 4000, panelClass: ['error-snackbar'], horizontalPosition: 'center', verticalPosition: 'top' }
      );
    }
  }

  canTakeQuiz(level: string): boolean {
    return this.levelAccess[level] && (this.progressSummary[level] || 0) >= 100;
  }

  hasAlreadyAttempted(level: string): boolean {
  const attempt = this.quizAttempts.find(a => a.quizType?.toUpperCase() === level.toUpperCase());
  return attempt ? attempt.score >= 70 : false; // e.g., 70% is passing threshold
}

hasFailedAttempt(level: string): boolean {
  const attempt = this.quizAttempts.find(a => a.quizType?.toUpperCase() === level.toUpperCase());
  return attempt ? attempt.score < 50 : false;
}



  getBadgeList(): string[] {
  return this.user?.badges
    ? this.user.badges.split(',').map(b => b.trim()).filter(b => b.length > 0)
    : [];
}

 goToResume(): void {
  if (!this.user || !this.loggedUser) return;

  const accessType = this.user.accessType || 'Full'; // FULL or SINGLE
  const level = this.currentLevel; // User's assigned level (for SINGLE access)

  // FULL ACCESS USERS
  if (accessType === 'Full') {
    if (this.lastContentVisited?.id) {
      this.router.navigate(['/content/play', this.lastContentVisited.id]);
    } else if (this.nextContent?.id) {
      this.router.navigate(['/content/play', this.nextContent.id]);
    } else {
      this.router.navigate(['/level', this.availableLevels[0], 'unit', 1]);
    }
  } 
  // SINGLE-LEVEL ACCESS USERS
  else if (accessType === 'Single') {
    if (this.lastContentVisited?.level === level) {
      this.router.navigate(['/content/play', this.lastContentVisited.id]);
    } else if (this.nextContent?.level === level) {
      this.router.navigate(['/content/play', this.nextContent.id]);
    } else {
      this.router.navigate(['/level', level, 'unit', 1]);
    }
  }
}



getBadgeIcon(badge: string): string {
  switch (badge.toLowerCase()) {
    case 'bronze':
      return 'fa-medal';
    case 'silver':
      return 'fa-medal';
    case 'gold':
      return 'fa-trophy';
    case 'platinum':
      return 'fa-gem';
    case 'diamond':
      return 'fa-gem';
    case 'master':
      return 'fa-crown';
    case 'legend':       // <-- Added Legend
      return 'fa-star';  // Use star icon for Legend (you can change)
    default:
      return 'fa-certificate';
  }
}


}



