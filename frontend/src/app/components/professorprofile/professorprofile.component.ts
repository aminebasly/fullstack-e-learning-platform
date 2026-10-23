import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Professor } from 'src/app/models/professor';
import { ProfessorService } from 'src/app/services/professor.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-professorprofile',
  templateUrl: './professorprofile.component.html',
  styleUrls: ['./professorprofile.component.css']
})
export class ProfessorprofileComponent implements OnInit {

  professor: Professor = new Professor();
  
  constructor(private professorService: ProfessorService,private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.getProfessorProfile();
  }

  // Fetch professor profile details by email
  getProfessorProfile(): void {
    const email = 'user@example.com'; // Replace with actual logged-in user's email
    this.professorService.getProfileDetails(email).subscribe(
      data => {
        this.professor = data; // Populate the professor model
      },
      error => {
        console.error('Error fetching professor details', error);
      }
    );
  }

  // Update professor profile
  onSubmit(): void {
    this.professorService.updateProfessor(this.professor.email, this.professor).subscribe(
      response => {
        this.snackBar.open('Profile updated successfully!', 'Close', {
  duration: 4000,
  panelClass: 'success-snackbar',
  horizontalPosition: 'center',
  verticalPosition: 'top'
});

      },
      error => {
        console.error('Error updating professor profile', error);
        this.snackBar.open('Failed to update profile.', 'Close', {
  duration: 4000,
  panelClass: 'error-snackbar',
  horizontalPosition: 'center',
  verticalPosition: 'top'
});

      }
    );
  }

  // Cancel the editing and reset form
  onCancel(): void {
    this.getProfessorProfile(); // Reset to the original data
  }
}
