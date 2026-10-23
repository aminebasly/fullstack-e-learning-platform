import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Professor } from 'src/app/models/professor';
import { User } from 'src/app/models/user';
import { ProfessorService } from 'src/app/services/professor.service';
import { RegistrationService } from 'src/app/services/registration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  user = new User();
  professor = new Professor();
  msg = ' ';
  activeTab: 'user' | 'professor' = 'user';
  showUserPassword: boolean = false;
showUserConfirmPassword: boolean = false;

// For Professor
showProfessorPassword: boolean = false;
showProfessorConfirmPassword: boolean = false;
  constructor(
    private _registrationService: RegistrationService,
    private _professorService: ProfessorService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    // No jQuery needed; activeTab defaults to 'user'
  }

  setActiveTab(tab: 'user' | 'professor'): void {
    this.activeTab = tab;
    this.msg = ' '; // Reset error message when switching tabs
  }

 registerUser(): void {
  if (this.user.password !== this.user.confirmPassword) {
    this.msg = 'Passwords do not match!';
    return;
  }

  this._registrationService.registerUserFromRemote(this.user).subscribe({
    next: () => {
      console.log('User registration successful');
      this._router.navigate(['/registrationsuccess']);
    },
    error: (error) => {
      console.log('User registration failed');
      this.msg = `User with ${this.user.email} already exists !!!`;
    }
  });
}
filterMobileInput(event: any): void {
  let value = event.target.value;
  // Remove all non-digits and "+"
  value = value.replace(/[^+\d]/g, '');
  // Ensure "+" is only allowed at the start
  value = value.replace(/(?!^)\+/g, '');
  event.target.value = value;
  this.user.mobile = value; // Or this.professor.mobile as needed
}
filterProfessorMobileInput(event: any): void {
  let value = event.target.value;
  value = value.replace(/[^+\d]/g, '');
  value = value.replace(/(?!^)\+/g, '');
  event.target.value = value;
  this.professor.mobile = value;
}



 registerProfessor(): void {
  if (this.professor.password !== this.professor.confirmPassword) {
    this.msg = 'Passwords do not match!';
    return;
  }

  this._registrationService.registerProfessorFromRemote(this.professor).subscribe({
    next: () => {
      console.log('Professor registration successful');
      this._router.navigate(['/registrationsuccess']);
    },
    error: (error) => {
      console.log('Professor registration failed');
      this.msg = `Professor with ${this.professor.email} already exists !!!`;
    }
  });
}
  togglePasswordVisibility(field: string): void {
    switch (field) {
      case 'userPassword':
        this.showUserPassword = !this.showUserPassword;
        break;
      case 'userConfirmPassword':
        this.showUserConfirmPassword = !this.showUserConfirmPassword;
        break;
      case 'professorPassword':
        this.showProfessorPassword = !this.showProfessorPassword;
        break;
      case 'professorConfirmPassword':
        this.showProfessorConfirmPassword = !this.showProfessorConfirmPassword;
        break;
    }
}
}