// upgrade-modal.component.ts
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upgrade-modal',
  templateUrl: './upgrade-modal.component.html',
  styleUrls: ['./upgrade-modal.component.css']
})
export class UpgradeModalComponent implements OnInit, OnDestroy {
  @Input() targetLevel: string = '';
  isOpen: boolean = false;
  private subscription: Subscription | undefined;

  constructor(private modalService: ModalService, private router: Router) {}

  ngOnInit() {
    this.subscription = this.modalService.modalTrigger$.subscribe(level => {
      console.log(`UpgradeModalComponent: Received level ${level}`);
      this.openModal(level);
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  openModal(level: string): void {
    this.targetLevel = level;
    this.isOpen = true;
  }

  closeModal(): void {
    this.isOpen = false;
    this.router.navigate(['/userdashboard']); // Redirect to user dashboard
  }

  upgrade(): void {
    console.log(`Upgrade to level ${this.targetLevel}`);
    
  }
}