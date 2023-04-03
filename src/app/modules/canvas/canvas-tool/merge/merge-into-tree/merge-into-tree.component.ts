import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Feature } from '../../../canvas-meta-artifact/feature';

@Component({
  selector: 'app-merge-into-tree',
  templateUrl: './merge-into-tree.component.html',
  styleUrls: ['./merge-into-tree.component.css'],
})
export class MergeIntoTreeComponent {
  @Input() expertModelId!: string;
  @Input() features!: { [id: string]: Feature };

  @Output() openTrace = new EventEmitter<string>();
  @Output() openDependencies = new EventEmitter<string>();
  @Output() updateFeature = new EventEmitter<string>();
  @Output() deleteFeature = new EventEmitter<string>();
}
