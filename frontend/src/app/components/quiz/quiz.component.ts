import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizAttemptService } from '../../services/quiz-attempt.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  quizType: string = '';
  questions: any[] = [];
  answers: number[] = [];
  submitted: boolean = false;
  score: number = 0;
  showModal: boolean = false;
  askPaymentModal: boolean = false;
  email: string = '';
  currentLevel: string = '';
  levelAdvanceMessage: string = '';
  isPreviewMode: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private quizService: QuizAttemptService,
    private router: Router,
    private loginService: LoginService
  ) {}

ngOnInit(): void {
  this.quizType = this.route.snapshot.paramMap.get('type') || '';

  this.loginService.getUserStatus().subscribe(status => {
    if (status) {
      this.email = status.email;

      // Check if it's admin or professor -> enable preview mode
      if (status.role === 'ADMIN' || status.role === 'PROFESSOR') {
        this.isPreviewMode = true;
      }
    }
  });

  this.loginService.fetchUserStatus().subscribe();

  this.quizService.getQuestionsByType(this.quizType).subscribe(data => {
    this.questions = data;
    this.answers = Array(data.length).fill(null);
  });
}


  submitQuiz(): void {
    if (this.isPreviewMode) return;
    this.submitted = true;
    let correct = 0;

    this.questions.forEach((q, i) => {
      if (this.answers[i] === q.correctOption) {
        correct++;
      }
    });

    this.score = Math.round((correct / this.questions.length) * 100);

    this.quizService.submitAttempt({
      quizType: this.quizType,
      score: this.score,
      email: this.email
    }).subscribe((response: any) => {
      this.showModal = true;
      this.currentLevel = response.currentLevel;
      const accessType = response.accessType;

      if (this.quizType.toUpperCase() !== 'PLACEMENT') {
        if (this.score >= 70) {
          if (accessType.toUpperCase() === 'FULL') {
            this.levelAdvanceMessage = `Congratulations! You've passed with ${this.score}% and advanced to ${this.currentLevel}.`;
          } else {
            this.levelAdvanceMessage = `You scored ${this.score}% - enough to advance to ${this.currentLevel}!`;
            this.askPaymentModal = true;
          }
        } else {
          this.levelAdvanceMessage = `You scored ${this.score}%. You need 70% to pass. Try again!`;
        }
      } else {
        this.levelAdvanceMessage = `Based on your score (${this.score}%), your recommended level is ${this.currentLevel}.`;
      }
    });
  }

  goToPayment(): void {
    this.router.navigate(['/payment']);
  }

  closeModal(): void {
    this.showModal = false;
    this.router.navigate(['/userdashboard']);
  }

   navigateToPanel(): void {
    this.router.navigate(['/Adminpanel']);
  }
}
