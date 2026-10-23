import { Component } from '@angular/core';
import { QuizAttemptService } from '../../services/quiz-attempt.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-admin-quiz-form',
  templateUrl: './admin-quiz-form.component.html',
  styleUrls: ['./admin-quiz-form.component.css']
})
export class AdminQuizFormComponent {
  quizType = 'PLACEMENT';
  questions: any[] = [];

  newQuestion = {
    text: '',
    type: 'MULTIPLE_CHOICE',
    options: ['', '', '', ''],
    correctOption: 1
  };

  constructor(private quizAttemptService: QuizAttemptService,private snackBar: MatSnackBar) {} // ✅ FIXED

  addQuestion() {
    this.questions.push({ ...this.newQuestion });
    this.resetForm();
  }

  resetForm() {
    this.newQuestion = {
      text: '',
      type: 'MULTIPLE_CHOICE',
      options: ['', '', '', ''],
      correctOption: 1
    };
  }

  trackByIndex(index: number, item: any): number {
  return index;
}


  submitAll() {
    const formattedQuestions = this.questions.map(q => ({
      ...q,
      quizType: this.quizType // Optional, only if backend expects it
    }));

    this.quizAttemptService.createQuestions(formattedQuestions).subscribe(() => {
      this.snackBar.open('Quizz submitted!', 'Close', {
  duration: 4000,
  panelClass: 'success-snackbar',
  horizontalPosition: 'center',
  verticalPosition: 'top'
});

      this.questions = [];
    });
  }
  removeQuestion(index: number) {
  this.questions.splice(index, 1);
}

}
