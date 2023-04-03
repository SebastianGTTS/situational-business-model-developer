import { RunningArtifact } from '../../../development-process-registry/running-process/running-artifact';
import { MethodDecision } from '../../../development-process-registry/bm-process/method-decision';
import { EventEmitter } from '@angular/core';

export type OutputMapping = OutputMappingItem[];

export type OutputMappingItem =
  | {
      artifact: number;
      version: number;
    }
  | { artifact: undefined };

export interface RunningProcessContextFakeExecuteModal {
  artifacts: RunningArtifact[];
  methodDecision: MethodDecision;

  onAllInputsSet(): void;

  addFakeExecution: EventEmitter<OutputMapping>;
}
