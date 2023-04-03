import { EventEmitter } from '@angular/core';
import { Hypothesis } from '../../../hypo-mo-map-meta-artifact/hypothesis';

export interface HypothesisDeleteModal {
  hypothesis?: Hypothesis;

  removeHypothesis: EventEmitter<string>;
}
