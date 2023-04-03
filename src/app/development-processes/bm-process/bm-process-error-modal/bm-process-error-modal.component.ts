import { Component, Input } from '@angular/core';
import { BmProcess } from '../../../development-process-registry/bm-process/bm-process';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-bm-process-error-modal',
  templateUrl: './bm-process-error-modal.component.html',
  styleUrls: ['./bm-process-error-modal.component.scss'],
})
export class BmProcessErrorModalComponent {
  @Input() bmProcess?: BmProcess;

  constructor(private activeModal: NgbActiveModal) {}

  dismiss(): void {
    this.activeModal.dismiss();
  }
}
