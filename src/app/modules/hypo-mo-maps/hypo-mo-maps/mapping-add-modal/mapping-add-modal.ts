import { HypoMoMap } from '../../hypo-mo-map-meta-model/hypo-mo-map';
import { Hypothesis } from '../../hypo-mo-map-meta-model/hypothesis';
import { MappingInit } from '../../hypo-mo-map-meta-model/mapping';
import { EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

export interface MappingAddModal {
  hypoMoMap?: HypoMoMap;
  hypothesisList?: Hypothesis[];
  mapping?: Partial<MappingInit>;

  addMapping: EventEmitter<FormGroup>;
}
