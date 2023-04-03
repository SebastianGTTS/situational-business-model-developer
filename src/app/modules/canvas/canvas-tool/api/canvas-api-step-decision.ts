import { StepDecision } from '../../../../development-process-registry/module-api/module-method';

export interface CanvasApiStepDecision extends StepDecision {
  companyModelId: string;
  automaticCreation: boolean;
}
