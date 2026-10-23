import { Component, ViewChild } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { UpgradeModalComponent } from './components/upgrade-modal/upgrade-modal.component'; // Import your modal component

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  isLoading = false;

  @ViewChild(UpgradeModalComponent) upgradeModal: UpgradeModalComponent | undefined;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      console.log('Router Event:', event); // Debug
      if (event instanceof NavigationStart) {
        this.isLoading = true; 
        console.log('isLoading set to true');// Show loading spinner during navigation
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.isLoading = false;
        console.log('isLoading set to false'); // Hide loading spinner when navigation completes or fails
      }
    });
  }

  // Method to open the upgrade modal from AppComponent
  openUpgradeModal(level: string) {
    if (this.upgradeModal) {
      this.upgradeModal.openModal(level); // Trigger the modal's open method
    }
  }
}
