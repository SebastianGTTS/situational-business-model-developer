import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Feature } from '../../../canvas-meta-model/feature';

@Component({
  selector: 'app-delete-feature-confirm',
  templateUrl: './delete-feature-confirm.component.html',
  styleUrls: ['./delete-feature-confirm.component.css'],
})
export class DeleteFeatureConfirmComponent {
  @Input() feature!: Feature;

  @Output() closeModal = new EventEmitter();
  @Output() deletionResult = new EventEmitter<string>();
}
