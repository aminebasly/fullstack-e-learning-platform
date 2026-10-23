import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent  {

  email: string = '';
  message: string = '';
  isSubmitted: boolean = false; // Track submission state

  constructor(private loginService: LoginService) {}

  onSubmit() {
    this.loginService.forgotPassword(this.email).subscribe(
      (response) => {
        console.log('Success Response:', response); // Debugging line
        this.isSubmitted = true;
        this.message = response.message; // Use the backend response message
      },
      (error: HttpErrorResponse) => {
        console.error('API Error:', error); // Debugging line
        this.isSubmitted = false;
        this.message = error.error?.message || 'Something went wrong. Please try again.';
      }
    );
  }
}