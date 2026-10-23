import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ContentService } from '../../services/content.service';
import { ProgressService } from '../../services/progress.service';
import { UserService } from '../../services/user.service';
import { LoginService } from '../../services/login.service';
import { Content, Question } from '../../models/contents';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  contentId!: number;
  content?: Content;
  currentQuestionIndex: number = 0;
  userAnswers: number[] = [];
  isQuizCompleted: boolean = false;
  userDetails: { email: string; role: string; accessType: string; currentLevel: string } | null = null;
  isLoggedIn: boolean = false;
  score: number = 0;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contentService: ContentService,
    private progressService: ProgressService,
    private userService: UserService,
    private loginService: LoginService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
  this.loginService.getUserStatus().subscribe({
    next: (status) => {
      this.userDetails = status;
      this.isLoggedIn = !!status?.email;
      this.cdr.detectChanges();

      if (!this.isLoggedIn || !status || !['USER', 'ADMIN', 'PROFESSOR'].includes(status.role)) {
        setTimeout(() => this.router.navigate(['/forbidden']), 0);
        return;
      }
        this.loadContentData();
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

  private loadContentData(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.contentId = +idParam;
        this.loadContent();
        if (this.userDetails?.email  && this.userDetails.role === 'USER') {
          this.userService.updateLastContentVisited(this.userDetails.email, this.contentId).subscribe({
            error: () => {
              this.snackBar.open('❌ Failed to update last content.', 'Close', {
                duration: 4000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['error-snackbar']
              });
              this.cdr.detectChanges();
            }
          });
        }
      } else {
        setTimeout(() => this.router.navigate(['/userdashboard']), 0);
      }
      this.cdr.detectChanges();
    });
  }

  getSafePdfUrl(pdfUrl: string): string {
    if (!pdfUrl) return '';
    if (pdfUrl.includes('google.com/viewer')) return pdfUrl;
    if (pdfUrl.includes('cloudinary.com') && pdfUrl.endsWith('.pdf')) {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
    }
    return `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
  }

  downloadPdf(pdfUrl: string) {
    const downloadUrl = pdfUrl + (pdfUrl.includes('?') ? '&dl=1' : '?dl=1');
    window.open(downloadUrl, '_blank');
  }

  openPdfInNewTab(pdfUrl: string) {
    window.open(this.getSafePdfUrl(pdfUrl), '_blank');
  }

  loadContent(): void {
    this.contentService.getContentById(this.contentId).subscribe({
      next: (data: Content) => {
        this.content = {
          ...data,
          questions: data.questions.map((q: Question) => ({
            ...q,
            correctOption: q.type === 'TRUE_FALSE' ? (q.correctOption === 1 ? 0 : 1) : q.correctOption
          }))
        };
        console.log('📄 PDF URL:', this.content.pdfUrl);
        this.userAnswers = new Array(this.content.questions.length).fill(-1);
        this.isQuizCompleted = false;
        this.currentQuestionIndex = 0;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Error loading content.';
        this.snackBar.open(this.errorMessage, 'Close', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        setTimeout(() => this.router.navigate(['/userdashboard']), 0);
        this.cdr.detectChanges();
      }
    });
  }

  selectAnswer(optionIndex: number): void {
    this.userAnswers[this.currentQuestionIndex] = optionIndex;
    this.cdr.detectChanges();
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < (this.content?.questions.length ?? 0) - 1) {
      this.currentQuestionIndex++;
    } else {
      this.completeQuiz();
    }
    this.cdr.detectChanges();
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
    this.cdr.detectChanges();
  }

  completeQuiz(): void {
    this.isQuizCompleted = true;
    this.score = this.calculateScore();
    this.cdr.detectChanges();
  }

  calculateScore(): number {
    if (!this.content) return 0;
    let correctCount = 0;
    this.content.questions.forEach((question, index) => {
      if (this.userAnswers[index] === question.correctOption) {
        correctCount++;
      }
    });
    return Math.round((correctCount / this.content.questions.length) * 100);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/userdashboard']);
  }

  markAsCompleted(): void {
    if (!this.content || !this.userDetails?.email || this.userDetails.role !== 'USER') return;
    this.progressService.markContentCompletedSimple(this.userDetails.email, this.content.id).subscribe({
      next: () => {
        this.snackBar.open('✅ Content marked as completed!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.cdr.detectChanges();
      },
      error: () => {
        this.snackBar.open('❌ Failed to mark content completed.', 'Close', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        this.cdr.detectChanges();
      }
    });
  }

  goBackToUnit(): void {
    if (this.content) {
      this.router.navigate(['/level', this.content.level, 'unit', this.content.unitNumber]);
    }
    this.cdr.detectChanges();
  }

   navigateToPanel(): void {
    this.router.navigate(['/Adminpanel']);
  }

  
}