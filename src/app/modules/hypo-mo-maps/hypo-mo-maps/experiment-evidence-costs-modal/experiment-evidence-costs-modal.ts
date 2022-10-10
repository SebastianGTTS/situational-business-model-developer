import { EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ExperimentUsed } from '../../hypo-mo-map-meta-model/experiment-used';

export interface ExperimentEvidenceCostsModal {
  experiment?: ExperimentUsed;

  setEvidenceCosts: EventEmitter<{
    experimentDefinitionId: string;
    experimentId: string;
    experiment: FormGroup;
  }>;
}
