import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Feature } from '../../../canvas-meta-model/feature';

@Component({
  selector: 'app-delete-decision-modal',
  templateUrl: './delete-decision-modal.component.html',
  styleUrls: ['./delete-decision-modal.component.css'],
})
export class DeleteDecisionModalComponent {
  @Input() feature!: Feature;

  @Output() closeModal = new EventEmitter<void>();
  @Output() deleteBusinessModelDecision = new EventEmitter<string>();
}
