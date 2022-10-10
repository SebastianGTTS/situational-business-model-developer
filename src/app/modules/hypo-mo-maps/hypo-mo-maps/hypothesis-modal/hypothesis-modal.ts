import { Hypothesis } from '../../hypo-mo-map-meta-model/hypothesis';
import { EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

export interface HypothesisModal {
  add: boolean;
  hypothesis?: Hypothesis;
  hypothesisList?: Hypothesis[];

  updateHypothesis: EventEmitter<FormGroup>;
}
