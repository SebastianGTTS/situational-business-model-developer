import { Domain } from '../../development-process-registry/knowledge/domain';
import { Selection } from '../../development-process-registry/development-method/selection';
import { SituationalFactor } from '../../development-process-registry/method-elements/situational-factor/situational-factor';
import { EventEmitter } from '@angular/core';

export interface RunningProcessContextChangeModal {
  domains: Domain[];
  situationalFactors: Selection<SituationalFactor>[];
  requestContextChange: EventEmitter<{
    comment: string;
    domains: Domain[];
    situationalFactors: Selection<SituationalFactor>[];
  }>;
}
