import { ConfigurationFormComponent } from './configuration-form-component';
import { Domain } from '../knowledge/domain';
import { EventEmitter } from '@angular/core';
import { BmProcess } from '../bm-process/bm-process';

export interface DecisionConfigurationFormComponent extends ConfigurationFormComponent {

  bmProcess: BmProcess;
  predefinedInput: any;
  contextDomains: Domain[];
  stepDecision: any;

  forceUpdate: EventEmitter<any>;

}
