import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Professor } from 'src/app/models/professor';
import { User } from 'src/app/models/user';
import { LoginService } from 'src/app/services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user = new User();
  professor = new Professor();
  msg = '';
  adminEmail = '';
  adminPassword = '';
  activeForm: string = 'user'; // Default form
  
  
  statusMessage: string = ''; // ✅ Fix: Declare the status message
  

  showPassword: boolean = false;


  constructor(private _service: LoginService,private snackBar: MatSnackBar, private _router: Router) {}

  ngOnInit(): void {
    // No jQuery needed; Angular handles form visibility with *ngIf
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  showForm(form: string) {
    this.activeForm = form;
    this.msg = ''; // Clear error message on form switch
  }

  loginUser() {
  this._service.loginUserFromRemote(this.user).subscribe({
    next: (data: any) => {
      console.log('User login success:', data);
      

     
      // Navigation logic
      if (data.accessType === 'None') {
        this.snackBar.open('You need to complete the payment before continuing.', 'Close', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: 'warning-snackbar'
        });
        this._router.navigate(['/payment']);
      } else if (!data.currentLevel) {
        this._router.navigate(['/quiz/placement']);
      } else if (data.accessType === 'Full' || data.accessType === 'Single') {
        this._router.navigate(['/userdashboard']);
      } else {
        this.snackBar.open('Access denied. Please contact support.', 'Close', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: 'error-snackbar'
        });
        this._router.navigate(['/login']);
      }
    },
    error: (error) => {
      console.error('User login error:', error);
      this.msg = 'Invalid credentials. Please check your email and password.';
    }
  });
}


 loginProfessor() {
  this._service.loginProfessorFromRemote(this.professor).subscribe({
    next: (data: any) => {
      console.log('Professor login success:', data);
      

      if (data.status === 'APPROVED') {
        this._router.navigate(['/professordashboard']);
      } else {
        this.statusMessage =
          data.status === 'PENDING'
            ? 'Your account is pending approval. Please wait for admin approval.'
            : 'Your account has been rejected by the admin.';
        this.openStatusModal();
      }
    },
    error: (error) => {
      console.error('Professor login error:', error);
      this.msg = 'Invalid credentials! Please try again.';
    }
  });
}

  
  
  // Function to show the modal
  openStatusModal() {
    const modal = document.getElementById('statusModal');
    if (modal) {
      (modal as any).style.display = 'block';
      (modal as any).classList.add('show');
    }
  }
  
  // Function to close the modal
  closeStatusModal() {
    const modal = document.getElementById('statusModal');
    if (modal) {
      (modal as any).style.display = 'none';
      (modal as any).classList.remove('show');
    }
  }
  
  

  adminLogin() {
  this._service.loginAdmin(this.adminEmail, this.adminPassword).subscribe({
    next: (data) => {
      
      this._router.navigate(['/admindashboard']);
    },
    error: () => {
      this.msg = 'Invalid admin credentials!';
    }
  });
}

}