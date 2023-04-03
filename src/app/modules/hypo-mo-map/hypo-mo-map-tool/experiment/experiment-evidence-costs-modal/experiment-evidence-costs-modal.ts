import { EventEmitter } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ExperimentUsed } from '../../../hypo-mo-map-meta-artifact/experiment-used';

export interface ExperimentEvidenceCostsModal {
  experiment?: ExperimentUsed;

  setEvidenceCosts: EventEmitter<{
    experimentDefinitionId: string;
    experimentId: string;
    experiment: UntypedFormGroup;
  }>;
}
