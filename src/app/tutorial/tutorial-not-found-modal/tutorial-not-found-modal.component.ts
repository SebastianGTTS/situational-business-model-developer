import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tutorial-not-found-modal',
  templateUrl: './tutorial-not-found-modal.component.html',
  styleUrls: ['./tutorial-not-found-modal.component.scss'],
})
export class TutorialNotFoundModalComponent {
  constructor(private activeModal: NgbActiveModal) {}

  dismiss(): void {
    this.activeModal.dismiss();
  }
}
