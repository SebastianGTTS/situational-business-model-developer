import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-leave-modal',
  templateUrl: './confirm-leave-modal.component.html',
  styleUrls: ['./confirm-leave-modal.component.css'],
})
export class ConfirmLeaveModalComponent {
  constructor(private activeModal: NgbActiveModal) {}

  close(): void {
    this.activeModal.dismiss();
  }

  leave(): void {
    this.activeModal.close(false);
  }

  saveChanges(): void {
    this.activeModal.close(true);
  }
}
