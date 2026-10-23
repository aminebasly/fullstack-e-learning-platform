import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  message: string = '';
  errorMessage: string = '';
  isSubmitted: boolean = false;

  constructor(private route: ActivatedRoute, private loginService: LoginService) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.loginService.resetPassword(this.token, this.newPassword).subscribe(
      (response) => {
        if (response.message === 'Password reset successfully.') {
          this.isSubmitted = true;
          this.message = 'Your password has been reset successfully.';
        } else {
          this.errorMessage = response.message; // e.g., "New password must be different"
        }
      },
      (error) => {
        this.errorMessage = error.error.message || 'Something went wrong.';
      }
    );
  }
}