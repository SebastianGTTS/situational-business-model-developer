import { EventEmitter } from '@angular/core';
import { Hypothesis } from '../../hypo-mo-map-meta-model/hypothesis';

export interface HypothesisDeleteModal {
  hypothesis?: Hypothesis;

  removeHypothesis: EventEmitter<string>;
}
