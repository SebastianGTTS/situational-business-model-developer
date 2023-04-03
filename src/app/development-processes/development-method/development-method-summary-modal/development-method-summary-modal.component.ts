import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DevelopmentMethodSummaryModal } from './development-method-summary-modal';
import { MethodDecision } from '../../../development-process-registry/bm-process/method-decision';

@Component({
  selector: 'app-development-method-summary-modal',
  templateUrl: './development-method-summary-modal.component.html',
  styleUrls: ['./development-method-summary-modal.component.css'],
})
export class DevelopmentMethodSummaryModalComponent
  implements DevelopmentMethodSummaryModal
{
  @Input() name?: string;
  @Input() methodDecision?: MethodDecision;

  constructor(private activeModal: NgbActiveModal) {}

  dismiss(): void {
    this.activeModal.dismiss();
  }
}
