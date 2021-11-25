import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Feature } from '../../../canvas-meta-model/feature';
import { Trace } from '../../../canvas-meta-model/trace';

@Component({
  selector: 'app-merge-tree',
  templateUrl: './merge-tree.component.html',
  styleUrls: ['./merge-tree.component.css'],
})
export class MergeTreeComponent {
  @Input() features: { [id: string]: Feature };
  @Input() trace: Trace;

  @Output() addTrace = new EventEmitter<string>();
  @Output() selectFeature = new EventEmitter<string>();
  @Output() openDependencies = new EventEmitter<string>();
  @Output() addAll = new EventEmitter<string>();
  @Output() openTrace = new EventEmitter<string>();

  asList(map: { [id: string]: Feature }): Feature[] {
    return Object.values(map);
  }
}
