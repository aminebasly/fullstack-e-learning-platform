import { Component, OnInit } from '@angular/core';
import { Professor, ProfessorStatus } from 'src/app/models/professor';
import { ProfessorService } from 'src/app/services/professor.service';
import { LoginService } from 'src/app/services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-professorlist',
  templateUrl: './professorlist.component.html',
  styleUrls: ['./professorlist.component.css']
})
export class ProfessorlistComponent implements OnInit {

  ProfessorStatus = ProfessorStatus;
  professors: Professor[] = [];
  keyword: string = '';
  currRole = 'Unknown';
  loggedUser = 'Guest';
  editingProfessor: Professor | null = null;
  isSidebarOpen: boolean = false;
  confirmDeleteEmail: string | null = null; 
  showPasswordFor: string | null = null; // reuse or declare separately if needed


  constructor(private _service: ProfessorService, private loginService: LoginService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loginService.getUserStatus().subscribe(status => {
      if (status) {
        this.loggedUser = status.email;
        this.currRole = status.role;
      }
    });

    this.loginService.fetchUserStatus().subscribe();

    this.loadProfessors();
  }

  loadProfessors(): void {
    this._service.getProfessorList().subscribe(data => {
      this.professors = data;
    });
  }

  togglePassword(email: string): void {
  this.showPasswordFor = this.showPasswordFor === email ? null : email;
}

  search(): void {
    if (this.keyword.trim() !== '') {
      this._service.searchProfessors(this.keyword).subscribe(data => {
        this.professors = data;
      });
    } else {
      this.loadProfessors();
    }
  }
  confirmDelete(email: string): void {
  this.confirmDeleteEmail = email;
}

cancelDelete(): void {
  this.confirmDeleteEmail = null;
}


  startEditing(professor: Professor): void {
    if (this.currRole.toLowerCase() === 'admin' && this.loggedUser === 'admin@gmail.com') {
      this.editingProfessor = { ...professor };
    }
  }

  saveProfessor(): void {
    if (this.editingProfessor && this.currRole.toLowerCase() === 'admin' && this.loggedUser === 'admin@gmail.com') {
      this._service.updateProfessor(this.editingProfessor.email, this.editingProfessor).subscribe({
        next: () => {
          this.loadProfessors();
          this.editingProfessor = null;
        },
        error: (error) => {
          console.error('Update professor failed:', error);
        }
      });
    }
  }

  cancelEditing(): void {
    this.editingProfessor = null;
  }

deleteProfessor(email: string): void {
  this._service.deleteProfessor(email).subscribe({
    next: () => {
      this.loadProfessors();
      this.confirmDeleteEmail = null;  // hide confirmation popup after delete
      this.snackBar.open('Professor deleted successfully.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['success-snackbar']
      });
    },
    error: (error) => {
      console.error('Delete professor failed:', error);
      this.snackBar.open('Error deleting professor.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    }
  });
}





  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.toggle('open', this.isSidebarOpen);
    }
  }
}
