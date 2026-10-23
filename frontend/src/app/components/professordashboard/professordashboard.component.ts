import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Observable } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import { LoginService } from 'src/app/services/login.service';
import { UserProgressService } from 'src/app/services/user-progress.service';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-professordashboard',
  templateUrl: './professordashboard.component.html',
  styleUrls: ['./professordashboard.component.css']
})
export class ProfessordashboardComponent implements OnInit {
  professor: any = { gender: '' };
  loggedUser = 'Guest';
  currRole = 'Unknown';
  gender: string = '';
  courses?: Observable<any[]>;
  enrollments?: Observable<any[]>;
  enrollmentcount?: Observable<any[]>;
  wishlist?: Observable<any[]>;
  chapters?: Observable<any[]>;
  isSidebarOpen: boolean = false;
  totalUsers: number = 0;
  totalCompletedContent: number = 0;
  professorsCount: number = 0;

  constructor(private _service: AdminService, private loginService: LoginService,private _uerprogressService: UserProgressService) {}

  public pieChartData: ChartData<'doughnut', number[], string | string[]> = {
  labels: ['Full Access Male', 'Full Access Female', 'Single Access Male', 'Single Access Female'],
  datasets: [{
    data: [0, 0, 0, 0],
    backgroundColor: ['#6a0dad', '#ff69b4', '#ff7e5f', '#28a745'],
    borderColor: '#fff',
    borderWidth: 2,
    hoverBackgroundColor: ['#6a0dad', '#ff69b4', '#ff7e5f', '#28a745'], // same as background
    hoverOffset: 0 // prevent segment from popping out
  }]
};

public pieChartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { color: '#333', font: { size: 14, weight: 'bold' } }
    },
    tooltip: { enabled: true }
  },
  cutout: '60%',
  rotation: -90,
  circumference: 180,
  animation: {
    animateRotate: true,
    animateScale: true
  },
  // Disable hover visual effects safely:
  hover: {
    mode: 'nearest', // required type
    intersect: false // ensures hover doesn't offset or change color
  },
  interaction: {
    mode: 'nearest', // tooltips still work
    intersect: true
  }
};

  ngOnInit(): void {
    this.loginService.getUserStatus().subscribe(status => {
      if (status) {
        this.professor.gender = status.gender; 
        this.loggedUser = status.email;
        this.currRole = status.role;
      } else {
        this.loggedUser = 'Guest';
        this.currRole = 'Unknown';
      }
      this.loadAdminData();
    });

    // Optional: fetch latest user status from backend (recommended on page load)
    this.loginService.fetchUserStatus().subscribe();

    $("#btn").click(function () {
      $(".sidebar").toggleClass("open");
      menuBtnChange();
    });

    $(".bx-search").click(function () {
      $(".sidebar").toggleClass("open");
      menuBtnChange();
    });

    function menuBtnChange() {
      if ($(".sidebar").hasClass("open")) {
        $("#btn").removeClass("fa-bars").addClass("fa-ellipsis-v");
      } else {
        $("#btn").removeClass("fa-ellipsis-v").addClass("fa-bars");
      }
    }

    
  }

   private loadAdminData(): void {

this._service.getUsersAccessGender().subscribe({
  next: (data) => {
    this.pieChartData = {
      labels: ['Full Access Male', 'Full Access Female', 'Single Access Male', 'Single Access Female'],
      datasets: [{
        data: [
          Number(data.fullAccess.male),
          Number(data.fullAccess.female),
          Number(data.singleAccess.male),
          Number(data.singleAccess.female)
        ],
        backgroundColor: ['#6a0dad', '#ff69b4', '#ff7e5f', '#28a745'],
        borderColor: '#fff',
        borderWidth: 2,
        hoverOffset: 20 // nice hover effect
      }]
    };
  },
  error: (err) => console.error('Failed to fetch users access by gender', err)
});

   this._service.getTotalProfessors()?.subscribe({
    next: (professors: any[] | number) => {
      // Convert to number explicitly
      this.professorsCount = Array.isArray(professors) ? professors.length : Number(professors);
    },
    error: (err) => {
      console.error('Failed to fetch professors:', err);
      this.professorsCount = 0;
    }
  });
    this._service.getTotalUsers()?.subscribe({
      next: (data: number) => {
        this.totalUsers = data;
      },
      error: (err) => {
        console.error('Failed to fetch total users:', err);
      }
    });
      this._uerprogressService.getTotalCompletedContent()?.subscribe({
    next: (data: number) => {
      this.totalCompletedContent = data;
    },
    error: (err) => {
      console.error('Failed to fetch completed content:', err);
      this.totalCompletedContent = 0;
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
