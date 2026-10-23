import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AdminpanelService } from '../../services/adminpanel.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-adminpanel',
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.css']
})
export class AdminpanelComponent implements OnInit {
  contentList: any[] = [];
  quizList: { quizType: string; questions: any[] }[] = [];
  levelFilter: string = '';
  quizTypeFilter: string = '';
  page = 0;
  size = 10;
  totalPages = 0;
  quizTotalPages = 0;
  loading = false;
  quizLoading = false;
  activeTab: 'content' | 'quiz' = 'content';

  levels: string[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
quizTypes: string[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'PLACEMENT'];
// Add these properties alongside your existing ones:
unitNumbers: number[] = [1, 2, 3];
contentNumbers: number[] = [1, 2, 3];

unitNumberFilter: number | '' = '';
contentNumberFilter: number | '' = '';




  @ViewChild('confirmDeleteDialog') confirmDeleteDialog!: TemplateRef<any>;
  selectedContentId: number | null = null;
  selectedQuizType: string | null = null;
  deleteType: 'content' | 'quiz' = 'content';

  constructor(
    private contentService: AdminpanelService,
    private snackBar: MatSnackBar,
    private _route: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchContent();
    this.fetchQuizzes();
  }

fetchContent(resetPage: boolean = false): void {
  if (resetPage) this.page = 0;
  this.loading = true;

  // Ensure level, unitNumber, and contentNumber are selected (not empty)
  if (
    this.levelFilter &&
    this.unitNumberFilter !== '' &&
    this.contentNumberFilter !== ''
  ) {
    this.contentService
      .getContentByLevelUnitContentNumber(
        this.levelFilter,
        this.unitNumberFilter,
        this.contentNumberFilter
      )
      .subscribe({
        next: (content) => {
          this.contentList = content ? [content] : [];
          this.totalPages = this.contentList.length > 0 ? 1 : 0;
          this.loading = false;
        },
        error: (err) => {
          console.error('Fetch filtered content error:', err);
          this.snackBar.open('Error fetching filtered content', 'Close', {
            duration: 3000,
            panelClass: 'error-snackbar',
  horizontalPosition: 'center',
  verticalPosition: 'top'
          });
          this.loading = false;
        },
      });
  } else {
    // fallback: list all content for the level with pagination
    this.contentService.getContentList(this.levelFilter, this.page, this.size).subscribe({
      next: (res) => {
        this.contentList = res.content;
        this.totalPages = res.totalPages;
        this.loading = false;
      },
      error: (err) => {
        console.error('Fetch content error:', err);
        this.snackBar.open('Error fetching content list', 'Close', { duration: 3000,
          panelClass: 'error-snackbar',
  horizontalPosition: 'center',
  verticalPosition: 'top'
         });
        this.loading = false;
      }
    });
  }
}



  fetchQuizzes(resetPage: boolean = false): void {
    if (resetPage) this.page = 0;
    this.quizLoading = true;

    this.contentService.getQuestionsByQuizType(this.quizTypeFilter).subscribe({
      next: (res) => {
        // Group questions by quizType
        const grouped: { [key: string]: any[] } = {};
        res.forEach((q: any) => {
          if (!grouped[q.quizType]) grouped[q.quizType] = [];
          grouped[q.quizType].push(q);
        });

        this.quizList = Object.keys(grouped).map((type) => ({
          quizType: type,
          questions: grouped[type]
        }));

        this.quizTotalPages = Math.ceil(this.quizList.length / this.size);
        this.quizLoading = false;
      },
      error: (err) => {
        console.error('Fetch quiz error:', err);
        this.snackBar.open('Error fetching quiz list', 'Close', { duration: 3000,
          panelClass: 'error-snackbar',
  horizontalPosition: 'center',
  verticalPosition: 'top'
         });
        this.quizLoading = false;
      }
    });
  }

  onSearch(type: 'content' | 'quiz'): void {
    if (type === 'content') {
      this.fetchContent(true);
    } else {
      this.fetchQuizzes(true);
    }
  }

  confirmDelete(idOrType: number | string, type: 'content' | 'quiz'): void {
    this.deleteType = type;
    if (type === 'content') {
      this.selectedContentId = idOrType as number;
      this.selectedQuizType = null;
    } else {
      this.selectedQuizType = idOrType as string;
      this.selectedContentId = null;
    }
    this.dialog.open(this.confirmDeleteDialog);
  }

  deleteConfirmed(): void {
    if (this.deleteType === 'content' && this.selectedContentId !== null) {
      this.contentService.deleteContent(this.selectedContentId).subscribe({
        next: () => {
          this.snackBar.open('Content deleted successfully', 'Close', {
            duration: 3000,
            panelClass: 'success-snackbar',
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.fetchContent();
          this.dialog.closeAll();
        },
        error: (err) => {
          console.error('Delete content error:', err);
          this.snackBar.open(`Error deleting content: ${err.message || 'Unknown error'}`, 'Close', {
            duration: 3000,
            panelClass: 'error-snackbar',
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.dialog.closeAll();
        }
      });
    } else if (this.deleteType === 'quiz' && this.selectedQuizType !== null) {
      // Delete all questions of quizType (level)
      this.contentService.deleteAllQuestionsByType(this.selectedQuizType).subscribe({
        next: () => {
          this.snackBar.open(`All questions for "${this.selectedQuizType}" deleted successfully`, 'Close', {
            duration: 3000,
            panelClass: 'success-snackbar',
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.fetchQuizzes();
          this.dialog.closeAll();
        },
        error: (err) => {
          console.error('Delete quiz error:', err);
          this.snackBar.open(`Error deleting quiz questions: ${err.message || 'Unknown error'}`, 'Close', {
            duration: 3000,
            panelClass: 'error-snackbar',
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.dialog.closeAll();
        }
      });
    }
  }

  changePage(delta: number, type: 'content' | 'quiz'): void {
    this.page += delta;
    if (type === 'content') {
      this.fetchContent();
    } else {
      this.fetchQuizzes();
    }
  }

  previewContent(content: any): void {
    this._route.navigate(['/content/play', content.id], { queryParams: { preview: true } });
  }

  previewQuiz(quizType: string): void {
  this._route.navigate(['/quiz', quizType], { queryParams: { preview: true } });
}


  navigateToAddContent(): void {
    this._route.navigate(['/content/create']);
  }

  navigateToAddQuiz(): void {
    this._route.navigate(['/quiz-form']);
  }

  switchTab(tab: 'content' | 'quiz'): void {
    this.activeTab = tab;
    this.page = 0;
    if (tab === 'content') {
      this.fetchContent(true);
    } else {
      this.fetchQuizzes(true);
    }
  }
}
