import { EventEmitter } from '@angular/core';
import { ExperimentUsed } from '../../../hypo-mo-map-meta-artifact/experiment-used';

export interface ExperimentDeleteModal {
  experiment?: ExperimentUsed;

  removeExperiment: EventEmitter<string>;
}
