import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { UserProfileDto } from 'src/app/models/user-profile.dto';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {
  users: User[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  showPasswordFor: string | null = null;

  editingEmail: string | null = null;
  editableUser: Partial<UserProfileDto> = {};
  editablePurchasedLevels: string[] = [];
  confirmDeleteEmail: string | null = null;

  searchTerm: string = '';
  private searchTerms = new Subject<string>();

  availableLevels: string[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  constructor(private _service: UserService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.fetchUsers();

    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => {
        this.isLoading = true;
        return term ? this._service.searchUsers(term) : this._service.getAllUsers();
      })
    ).subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Search error:', err);
        this.errorMessage = 'Error searching users.';
        this.isLoading = false;
        this.showErrorSnackBar('Error searching users.');
      }
    });
  }

  private fetchUsers(): void {
    this._service.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.errorMessage = 'Error fetching user data.';
        this.isLoading = false;
        this.showErrorSnackBar('Error fetching user data.');
      }
    });
  }

  togglePassword(email: string): void {
    this.showPasswordFor = this.showPasswordFor === email ? null : email;
  }

  editUser(user: User): void {
    this.editingEmail = user.email;

    // ✅ Initialisation sécurisée pour éviter form.invalid
    this.editableUser = {
      username: user.username || '',
      mobile: user.mobile || '',
      gender: user.gender || '',
      profession: user.profession || '',
      address: user.address || '',
      password: user.password || '',
      accessType: user.accessType || 'None',
      currentLevel: user.currentLevel || '',
      purchasedLevel: user.purchasedLevel || '',
    };

    this.editablePurchasedLevels = user.purchasedLevel ? user.purchasedLevel.split(',') : [];
  }

  search(query: string): void {
    this.searchTerms.next(query);
  }

  cancelEdit(): void {
    this.editingEmail = null;
    this.editableUser = {};
    this.editablePurchasedLevels = [];
  }

  saveUser(userForm: NgForm): void {
    if (!this.editingEmail || userForm.invalid) return;

    const userToUpdate: UserProfileDto = {
      ...this.editableUser,
      purchasedLevel: this.editablePurchasedLevels.join(',')
    };

    this._service.updateUserProfile(this.editingEmail, userToUpdate).subscribe({
  next: (updatedUser) => {
    const index = this.users.findIndex(u => u.email === this.editingEmail);
    if (index !== -1) {
      const userToUpdate = this.users[index];
      userToUpdate.username = updatedUser.username ?? userToUpdate.username;
      userToUpdate.mobile = updatedUser.mobile ?? userToUpdate.mobile;
      userToUpdate.gender = updatedUser.gender ?? userToUpdate.gender;
      userToUpdate.profession = updatedUser.profession ?? userToUpdate.profession;
      userToUpdate.address = updatedUser.address ?? userToUpdate.address;
      userToUpdate.password = updatedUser.password ?? userToUpdate.password;
      userToUpdate.accessType = updatedUser.accessType ?? userToUpdate.accessType;
      userToUpdate.currentLevel = updatedUser.currentLevel ?? userToUpdate.currentLevel;
      userToUpdate.purchasedLevel = updatedUser.purchasedLevel ?? userToUpdate.purchasedLevel;
      userToUpdate.badges = updatedUser.badges ?? userToUpdate.badges;
      userToUpdate.confirmPassword = updatedUser.confirmPassword ?? userToUpdate.confirmPassword;
      userToUpdate.role = updatedUser.role ?? userToUpdate.role;
      userToUpdate.resetPasswordToken = updatedUser.resetPasswordToken ?? userToUpdate.resetPasswordToken;
      userToUpdate.paymentRequired = updatedUser.paymentRequired ?? userToUpdate.paymentRequired;
      userToUpdate.quizCompleted = updatedUser.quizCompleted ?? userToUpdate.quizCompleted;
    }
    this.showSuccessSnackBar('User profile updated successfully!');
    this.cancelEdit();
  },
  error: (err) => {
    console.error('Update failed:', err);
    this.showErrorSnackBar('Failed to update user profile.');
  }
});

  }

  confirmDelete(email: string): void {
    this.confirmDeleteEmail = email;
  }

  cancelDelete(): void {
    this.confirmDeleteEmail = null;
  }

  deleteUser(emailToDelete: string): void {
    this._service.deleteUserByEmail(emailToDelete).subscribe({
      next: () => {
        this.users = this.users.filter(user => user.email !== emailToDelete);
        this.confirmDeleteEmail = null;
        this.showSuccessSnackBar('User deleted successfully!');
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        this.showErrorSnackBar('Error deleting user.');
      }
    });
  }

  onCheckboxChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.value;

    if (checkbox.checked) {
      if (!this.editablePurchasedLevels.includes(value)) {
        this.editablePurchasedLevels.push(value);
      }
    } else {
      this.editablePurchasedLevels = this.editablePurchasedLevels.filter(level => level !== value);
    }
  }

  getPurchasedLevels(user: User): string[] {
    return user.purchasedLevel ? user.purchasedLevel.split(',') : [];
  }

  trackByEmail(index: number, user: User): string {
    return user.email;
  }

  private showSuccessSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      panelClass: 'success-snackbar',
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  private showErrorSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 6000,
      panelClass: 'error-snackbar',
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
