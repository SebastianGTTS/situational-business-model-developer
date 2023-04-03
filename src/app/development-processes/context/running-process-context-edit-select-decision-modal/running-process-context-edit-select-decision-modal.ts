import { DevelopmentMethodEntry } from '../../../development-process-registry/development-method/development-method';
import { EventEmitter } from '@angular/core';
import { RemovedMethod } from '../../../development-process-registry/running-process/removed-method';
import { ContextChangeRunningProcess } from '../../../development-process-registry/running-process/running-full-process';

export interface RunningProcessContextEditSelectDecisionModal {
  runningProcess: ContextChangeRunningProcess;
  developmentMethod: DevelopmentMethodEntry;
  removedMethods: RemovedMethod[];

  onAllInputsSet(): void;

  insertDevelopmentMethodDecision: EventEmitter<RemovedMethod>;
  insertDevelopmentMethodNew: EventEmitter<void>;
}
