import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExperimentUsed } from '../../hypo-mo-map-meta-model/experiment-used';

@Component({
  selector: 'app-used-experiment-tree',
  templateUrl: './used-experiment-tree.component.html',
  styleUrls: ['./used-experiment-tree.component.css'],
})
export class UsedExperimentTreeComponent {
  @Input() editable = true;
  @Input() usedExperiments!: ExperimentUsed[];

  @Output() addHypothesis = new EventEmitter<{
    experimentDefinitionId: string;
    experimentId: string;
  }>();
  @Output() setCostAndScore = new EventEmitter<{
    experimentDefinitionId: string;
    experimentId: string;
  }>();
  @Output() showMappings = new EventEmitter<{
    experimentDefinitionId: string;
    experimentId: string;
  }>();
  @Output() showArtifacts = new EventEmitter<{
    experimentDefinitionId: string;
    experimentId: string;
  }>();
  @Output() deleteExperiment = new EventEmitter<string>();
}
