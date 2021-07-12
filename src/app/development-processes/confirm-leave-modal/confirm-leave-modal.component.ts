import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-leave-modal',
  templateUrl: './confirm-leave-modal.component.html',
  styleUrls: ['./confirm-leave-modal.component.css']
})
export class ConfirmLeaveModalComponent {

  constructor(
    private activeModal: NgbActiveModal
  ) {
  }

  close() {
    this.activeModal.dismiss();
  }

  leave() {
    this.activeModal.close(false);
  }

  saveChanges() {
    this.activeModal.close(true);
  }
}
