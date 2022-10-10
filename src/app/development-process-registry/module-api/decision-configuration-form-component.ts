import { ConfigurationFormComponent } from './configuration-form-component';
import { Domain } from '../knowledge/domain';
import { EventEmitter } from '@angular/core';
import { BmProcess } from '../bm-process/bm-process';
import { PredefinedInput, StepDecision } from './module-method';
import { RunningProcess } from '../running-process/running-process';

export interface DecisionConfigurationFormComponent
  extends ConfigurationFormComponent {
  bmProcess?: BmProcess;
  runningProcess?: RunningProcess;
  predefinedInput?: PredefinedInput;
  contextDomains: Domain[];
  stepDecision?: StepDecision;

  forceUpdate: EventEmitter<StepDecision>;
}
