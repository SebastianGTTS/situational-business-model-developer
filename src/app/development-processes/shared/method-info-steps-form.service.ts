import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ExecutionStep } from '../../development-process-registry/development-method/execution-step';
import { ModuleService } from '../../development-process-registry/module-api/module.service';

@Injectable({
  providedIn: 'root',
})
export class MethodInfoStepsFormService {
  constructor(private fb: FormBuilder, private moduleService: ModuleService) {}

  createForm(executionSteps: ExecutionStep[], stepDecisions: any[]): FormArray {
    return this.fb.array(
      stepDecisions.map((step, index) =>
        this.createStepDecisionForm(executionSteps[index], step)
      )
    );
  }

  createStepDecisionForm(
    executionStep: ExecutionStep,
    stepDecision: any
  ): FormGroup {
    const method = this.moduleService.getModuleMethod(
      executionStep.module,
      executionStep.method
    );
    if (method != null && method.createDecisionConfigurationForm != null) {
      return method.createDecisionConfigurationForm(stepDecision);
    }
    return undefined;
  }

  getStepDecisions(form: any[]): any[] {
    return form;
  }
}
