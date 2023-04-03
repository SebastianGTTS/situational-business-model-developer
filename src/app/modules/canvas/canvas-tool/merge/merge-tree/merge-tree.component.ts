import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Feature } from '../../../canvas-meta-artifact/feature';
import { Trace } from '../../../canvas-meta-artifact/trace';

@Component({
  selector: 'app-merge-tree',
  templateUrl: './merge-tree.component.html',
  styleUrls: ['./merge-tree.component.css'],
})
export class MergeTreeComponent {
  @Input() features!: { [id: string]: Feature };
  @Input() trace!: Trace;

  @Output() addTrace = new EventEmitter<string>();
  @Output() selectFeature = new EventEmitter<string>();
  @Output() openDependencies = new EventEmitter<string>();
  @Output() addAll = new EventEmitter<string>();
  @Output() openTrace = new EventEmitter<string>();
}
