import { Hypothesis } from '../../../hypo-mo-map-meta-artifact/hypothesis';
import { EventEmitter } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

export interface HypothesisModal {
  add: boolean;
  hypothesis?: Hypothesis;
  hypothesisList?: Hypothesis[];

  updateHypothesis: EventEmitter<UntypedFormGroup>;
}
