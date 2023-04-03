import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  ExecutionStep,
  isMethodExecutionStep,
} from '../../../development-process-registry/development-method/execution-step';
import { MethodExecutionStep } from '../../../development-process-registry/development-method/method-execution-step';
import { ModuleMethod } from '../../../development-process-registry/module-api/module-method';
import { ModuleService } from '../../../development-process-registry/module-api/module.service';

@Component({
  selector: 'app-development-method-overview-execution-steps',
  templateUrl: './development-method-overview-execution-steps.component.html',
  styleUrls: ['./development-method-overview-execution-steps.component.scss'],
})
export class DevelopmentMethodOverviewExecutionStepsComponent
  implements OnChanges
{
  @Input() executionSteps!: ExecutionStep[];

  executionStepMethods: (ModuleMethod | undefined)[] = [];

  constructor(private moduleService: ModuleService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.executionSteps) {
      const currentExecutionSteps: ExecutionStep[] =
        changes.executionSteps.currentValue;
      this.executionStepMethods = currentExecutionSteps.map((executionStep) => {
        if (this.isMethodExecutionStep(executionStep)) {
          return this.moduleService.getModuleMethod(
            executionStep.module,
            executionStep.method
          );
        } else {
          return undefined;
        }
      });
    }
  }

  hasDescription(index: number): boolean {
    const step = this.executionSteps[index];
    if (this.isMethodExecutionStep(step)) {
      const description = this.executionStepMethods[index]?.description;
      return description != null && description != '';
    } else {
      return step.description != '';
    }
  }

  getDescription(index: number): string {
    const step = this.executionSteps[index];
    if (this.isMethodExecutionStep(step)) {
      return this.executionStepMethods[index]?.description ?? '';
    } else {
      return step.description;
    }
  }

  isMethodExecutionStep(step: ExecutionStep): step is MethodExecutionStep {
    return isMethodExecutionStep(step);
  }
}
