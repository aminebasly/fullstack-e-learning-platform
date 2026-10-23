// modal.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalTrigger = new Subject<string>();
  modalTrigger$ = this.modalTrigger.asObservable();

  triggerModal(level: string) {
    console.log(`ModalService: Triggering modal for level ${level}`);
    this.modalTrigger.next(level);
  }
}