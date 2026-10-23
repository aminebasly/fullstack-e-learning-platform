import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfileDto } from 'src/app/models/user-profile.dto';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { LoginService } from 'src/app/services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {
  profileDetails?: User;
  userProfile: UserProfileDto = {
    username: '',
    profession: '',
    gender: '',
    mobile: '',
    address: '',
    password: '',
    confirmPassword: ''
  };

  loggedUser: string = '';
  isEditing: boolean = false;
  msg: string = '';
  temp: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private userService: UserService,
    private loginService: LoginService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Wait for logged-in user email before loading profile
    this.loginService.getUserStatus().subscribe({
      next: (status) => {
        if (status && status.email) {
          this.loggedUser = status.email;
          this.loadProfileDetails();
        } else {
          this.msg = 'Unable to fetch user details.';
        }
      },
      error: (err) => {
        console.error('Error fetching user status', err);
        this.msg = 'Unable to fetch user details.';
      }
    });
  }

  // Load user profile from backend
  loadProfileDetails(): void {
    if (!this.loggedUser) return;
    this.userService.getProfileDetails(this.loggedUser).subscribe({
      next: (data: User) => {
        this.profileDetails = data;
      },
      error: (err) => {
        console.error('Error loading profile', err);
        this.msg = 'Error loading profile. Please try again later.';
      }
    });
  }

  // Start editing
  editProfile(): void {
    if (!this.profileDetails) {
      this.msg = 'Profile not loaded yet.';
      return;
    }
    this.userProfile = {
      username: this.profileDetails.username || '',
      profession: this.profileDetails.profession || '',
      gender: this.profileDetails.gender || '',
      mobile: this.profileDetails.mobile || '',
      address: this.profileDetails.address || '',
      password: '',
      confirmPassword: ''
    };
    this.isEditing = true;
    this.msg = '';
  }

  // Cancel editing
  onCancel(): void {
    this.isEditing = false;
    this.msg = '';
  }

  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Submit updated profile
  updateUserProfile(): void {
    if (this.userProfile.password && this.userProfile.password !== this.userProfile.confirmPassword) {
      this.msg = 'Passwords do not match!';
      this.temp = false;
      return;
    }

    // Remove confirmPassword before sending to backend
    const { confirmPassword, ...userProfileToSend } = this.userProfile;

    this.userService.updateUserProfile(this.loggedUser, userProfileToSend).subscribe({
      next: (updatedUser: UserProfileDto) =>  {
        this.msg = 'Profile Updated Successfully!';
        this.temp = true;
        this.isEditing = false;
        

        this.snackBar.open('Profile updated successfully!', 'Close', {
          duration: 4000,
          panelClass: 'success-snackbar',
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });

        // Optionally navigate back after a few seconds
        setTimeout(() => {
          this.router.navigate(['/userdashboard']);
        }, 3000);
      },
      error: (err) => {
        console.error('Error updating profile', err);
        this.msg = err?.error?.message || 'Profile update failed!';
        this.temp = false;
        this.snackBar.open('Failed to update profile.', 'Close', {
          duration: 4000,
          panelClass: 'error-snackbar',
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }
}
