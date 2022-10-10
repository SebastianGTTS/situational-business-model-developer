import { Hypothesis } from '../../hypo-mo-map-meta-model/hypothesis';
import { ExperimentUsed } from '../../hypo-mo-map-meta-model/experiment-used';
import { EventEmitter } from '@angular/core';

export interface HypothesisMappingsModal {
  hypothesis?: Hypothesis;
  mappings?: { experiment: ExperimentUsed; metric: string }[];

  removeMapping: EventEmitter<{
    experimentDefinitionId: string;
    experimentId: string;
    hypothesisId: string;
  }>;
}
