import { Component, Input } from '@angular/core';
import { ExperimentUsed } from '../../../hypo-mo-map-meta-artifact/experiment-used';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-artifacts-show-modal',
  templateUrl: './artifacts-show-modal.component.html',
  styleUrls: ['./artifacts-show-modal.component.css'],
})
export class ArtifactsShowModalComponent {
  @Input() experiment?: ExperimentUsed;

  constructor(private activeModal: NgbActiveModal) {}

  dismiss(): void {
    this.activeModal.dismiss();
  }
}
