import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Hypothesis } from '../../../hypo-mo-map-meta-artifact/hypothesis';
import { ExperimentUsed } from '../../../hypo-mo-map-meta-artifact/experiment-used';

@Component({
  selector: 'app-hypothesis-tree',
  templateUrl: './hypothesis-tree.component.html',
  styleUrls: ['./hypothesis-tree.component.css'],
})
export class HypothesisTreeComponent {
  @Input() hypotheses!: Hypothesis[];
  @Input() hypothesisExperimentMap: {
    [hypothesisId: string]: { metric: string; experiment: ExperimentUsed }[];
  } = {};
  @Input() processPhase!: 'stepInit' | 'stepMap' | 'stepAdaption' | 'stepView';

  @Output() addExperiment = new EventEmitter<string>();
  @Output() showMappings = new EventEmitter<string>();
  @Output() addHypothesis = new EventEmitter<string>();
  @Output() updateHypothesis = new EventEmitter<string>();
  @Output() deleteHypothesis = new EventEmitter<string>();
}
