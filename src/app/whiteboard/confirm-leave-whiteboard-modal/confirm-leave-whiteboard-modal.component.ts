import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-leave-whiteboard-modal',
  templateUrl: './confirm-leave-whiteboard-modal.component.html',
  styleUrls: ['./confirm-leave-whiteboard-modal.component.css'],
})
export class ConfirmLeaveWhiteboardModalComponent {
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
