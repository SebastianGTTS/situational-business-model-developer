import { Router } from '@angular/router';
import { RunningProcess } from '../running-process/running-process';
import { RunningMethod } from '../running-process/running-method';
import { StepArtifact } from '../running-process/step-artifact';

/**
 * Defines the data that the method of a module gets if it is executed
 */
export interface MethodExecutionInput {

  router: Router;
  runningProcess: RunningProcess;
  runningMethod: RunningMethod;
  predefinedInput: any;
  inputStepArtifacts: StepArtifact[];

}
