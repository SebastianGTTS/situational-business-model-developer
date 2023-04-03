import { Component, Input } from '@angular/core';
import { RunningProcess } from '../../../development-process-registry/running-process/running-process';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-running-process-ask-finish-modal',
  templateUrl: './running-process-ask-finish-modal.component.html',
  styleUrls: ['./running-process-ask-finish-modal.component.scss'],
})
export class RunningProcessAskFinishModalComponent {
  @Input() runningProcess?: RunningProcess;

  constructor(private activeModal: NgbActiveModal) {}

  finish(): void {
    this.activeModal.close(true);
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }
}
