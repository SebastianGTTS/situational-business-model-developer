import { ExperimentUsed } from '../../hypo-mo-map-meta-model/experiment-used';
import { Hypothesis } from '../../hypo-mo-map-meta-model/hypothesis';
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
