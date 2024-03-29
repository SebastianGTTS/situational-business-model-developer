import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Experiment } from '../../../hypo-mo-map-meta-artifact/experiment';

@Component({
  selector: 'app-experiment-tree',
  templateUrl: './experiment-tree.component.html',
  styleUrls: ['./experiment-tree.component.css'],
})
export class ExperimentTreeComponent {
  @Input() experiments!: Experiment[];
  @Input() viewOnly = false;

  @Output() manageArtifacts = new EventEmitter<string>();
  @Output() addExperiment = new EventEmitter<string>();
  @Output() updateExperiment = new EventEmitter<string>();
  @Output() deleteExperiment = new EventEmitter<string>();
}
