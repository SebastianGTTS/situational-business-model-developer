import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RunningProcess } from '../../../development-process-registry/running-process/running-process';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-running-process-finish-modal',
  templateUrl: './running-process-finish-modal.component.html',
  styleUrls: ['./running-process-finish-modal.component.scss'],
})
export class RunningProcessFinishModalComponent {
  @Input() runningProcess?: RunningProcess;

  conclusionForm = this.fb.nonNullable.group({
    conclusion: [''],
  });

  constructor(private activeModal: NgbActiveModal, private fb: FormBuilder) {}

  finishMethod(): void {
    this.activeModal.close(this.conclusionForm.getRawValue().conclusion);
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }
}
