import { HypoMoMap } from '../../hypo-mo-map-meta-artifact/hypo-mo-map';
import { Hypothesis } from '../../hypo-mo-map-meta-artifact/hypothesis';
import { MappingInit } from '../../hypo-mo-map-meta-artifact/mapping';
import { EventEmitter } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

export interface MappingAddModal {
  hypoMoMap?: HypoMoMap;
  hypothesisList?: Hypothesis[];
  mapping?: Partial<MappingInit>;

  addMapping: EventEmitter<UntypedFormGroup>;
}
