import { EventEmitter } from '@angular/core';
import { ExperimentDefinitionEntry } from '../../../hypo-mo-map-meta-artifact/experiment-definition';

export interface ExperimentAddModal {
  experiments?: ExperimentDefinitionEntry[];

  addExperiment: EventEmitter<ExperimentDefinitionEntry>;
}
