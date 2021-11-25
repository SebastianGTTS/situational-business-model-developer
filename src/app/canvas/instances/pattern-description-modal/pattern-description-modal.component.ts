import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Instance } from '../../../canvas-meta-model/instance';

@Component({
  selector: 'app-pattern-description-modal',
  templateUrl: './pattern-description-modal.component.html',
  styleUrls: ['./pattern-description-modal.component.css'],
})
export class PatternDescriptionModalComponent {
  @Input() pattern: Instance;

  constructor(private activeModal: NgbActiveModal) {}

  dismiss(): void {
    this.activeModal.dismiss();
  }
}
