import { ExperimentUsed } from '../../../hypo-mo-map-meta-artifact/experiment-used';
import { Hypothesis } from '../../../hypo-mo-map-meta-artifact/hypothesis';
import { EventEmitter } from '@angular/core';

export interface ExperimentMappingsModal {
  experiment?: ExperimentUsed;
  mappings?: { hypothesis: Hypothesis; metric: string }[];

  removeMapping: EventEmitter<{
    experimentDefinitionId: string;
    experimentId: string;
    hypothesisId: string;
  }>;
}
