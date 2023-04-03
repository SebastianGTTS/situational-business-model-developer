import { Injectable } from '@angular/core';
import { Module } from '../../development-process-registry/module-api/module';
import { MethodExecutionStep } from '../../development-process-registry/development-method/method-execution-step';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ModuleService } from '../../development-process-registry/module-api/module.service';
import { ArtifactMapping } from '../../development-process-registry/development-method/artifact-mapping';
import {
  ArtifactMappingFormService,
  MappingsFormValue,
  MappingsFormValueValid,
} from './artifact-mapping-form.service';
import {
  ModuleMethod,
  PredefinedInput,
} from '../../development-process-registry/module-api/module-method';
import {
  ExecutionStep,
  isMethodExecutionStep,
} from '../../development-process-registry/development-method/execution-step';
import { EmptyExecutionStep } from '../../development-process-registry/development-method/empty-execution-step';

export type ExecutionStepsFormValue = ExecutionStepFormValue[];
export type ExecutionStepsFormValueValid = ExecutionStepFormValueValid[];

export type ExecutionStepFormValue =
  | EmptyExecutionStepFormValue
  | MethodExecutionStepFormValue;

export type ExecutionStepFormValueValid =
  | EmptyExecutionStepFormValueValid
  | MethodExecutionStepFormValueValid;

export interface EmptyExecutionStepFormValue {
  isMethod: false;
  name?: string;
  description?: string;
}

export interface EmptyExecutionStepFormValueValid
  extends EmptyExecutionStepFormValue {
  name: string;
  description: string;
}

export interface MethodExecutionStepFormValue {
  isMethod: true;
  module?: Module;
  method?: ModuleMethod;
  outputMappings?: MappingsFormValue[];
  predefinedInput?: PredefinedInput;
}

export interface MethodExecutionStepFormValueValid
  extends MethodExecutionStepFormValue {
  module: Module;
  method: ModuleMethod;
  outputMappings: MappingsFormValueValid[];
  predefinedInput: PredefinedInput;
}

@Injectable({
  providedIn: 'root',
})
export class ExecutionStepsFormService {
  constructor(
    private artifactMappingService: ArtifactMappingFormService,
    private fb: UntypedFormBuilder,
    private moduleService: ModuleService
  ) {}

  createForm(executionSteps: ExecutionStep[]): UntypedFormArray {
    return this.fb.array(
      executionSteps.map((step) => this.createExecutionStepForm(step))
    );
  }

  createExecutionStepForm(executionStep?: ExecutionStep): UntypedFormGroup {
    if (executionStep == null || isMethodExecutionStep(executionStep)) {
      return this.createMethodExecutionStepForm(executionStep);
    } else {
      return this.createEmptyExecutionStepForm(executionStep);
    }
  }

  private createMethodExecutionStepForm(
    methodExecutionStep?: MethodExecutionStep
  ): UntypedFormGroup {
    let module: Module | undefined;
    let method: ModuleMethod | undefined;
    if (methodExecutionStep != null) {
      module = this.moduleService.getModule(methodExecutionStep.module);
      method = module?.methods[methodExecutionStep.method];
    }
    return this.fb.group({
      isMethod: [true, Validators.required],
      module: [module, Validators.required],
      method: [method, Validators.required],
      outputMappings: this.createMappingsForm(
        method,
        methodExecutionStep?.outputMappings
      ),
      predefinedInput: this.createPredefinedInputForm(
        method,
        methodExecutionStep?.predefinedInput
      ),
    });
  }

  private createEmptyExecutionStepForm(
    emptyExecutionStep?: EmptyExecutionStep
  ): UntypedFormGroup {
    return this.fb.group({
      isMethod: [false, Validators.required],
      name: [emptyExecutionStep?.name, Validators.required],
      description: [emptyExecutionStep?.description ?? ''],
    });
  }

  createMappingsForm(
    method?: ModuleMethod,
    outputMappings?: ArtifactMapping[][]
  ): UntypedFormArray {
    let outputs: UntypedFormArray[] = [];
    if (method != null) {
      outputs = method.output.map((output, index) => {
        let mappings: ArtifactMapping[] = [];
        if (outputMappings && index < outputMappings.length) {
          mappings = outputMappings[index];
        }
        return this.artifactMappingService.createMappingsForm(mappings);
      });
    }
    return this.fb.array(outputs);
  }

  createPredefinedInputForm(
    method?: ModuleMethod,
    predefinedInput?: PredefinedInput
  ): UntypedFormGroup | undefined {
    if (method != null && method.createConfigurationForm != null) {
      return method.createConfigurationForm(predefinedInput);
    }
    return undefined;
  }

  /**
   * Add an execution step to the form.
   *
   * @param executionStepForm the execution step form
   */
  addExecutionStep(executionStepForm: UntypedFormArray): void {
    executionStepForm.push(this.createExecutionStepForm());
  }

  /**
   * Called if the method of an execution step has changed.
   *
   * @param executionStepForm the execution step form
   * @param step the index of the step to remove
   */
  executionStepMethodChange(
    executionStepForm: UntypedFormArray,
    step: number
  ): void {
    executionStepForm.controls.forEach((executionStepControl) => {
      const outputMappings = executionStepControl.get('outputMappings') as
        | UntypedFormArray
        | undefined;
      outputMappings?.controls.forEach((mappingControl) => {
        this.artifactMappingService.resetMappingTo(
          mappingControl as UntypedFormArray,
          step
        );
      });
    });
  }

  /**
   * Called if the type of execution step changed
   *
   * @param executionStepForm
   * @param step
   * @param isMethod
   */
  executionStepTypeChange(
    executionStepForm: UntypedFormArray,
    step: number,
    isMethod: boolean
  ): void {
    this.executionStepMethodChange(executionStepForm, step);
    executionStepForm.setControl(
      step,
      isMethod
        ? this.createMethodExecutionStepForm()
        : this.createEmptyExecutionStepForm()
    );
  }

  /**
   * Remove an execution step from the form and remove all mappings to it.
   *
   * @param executionStepForm the execution step form
   * @param step the index of the step to remove
   */
  removeExecutionStep(executionStepForm: UntypedFormArray, step: number): void {
    executionStepForm.controls.forEach((executionStepControl) => {
      if (executionStepControl.get('isMethod')?.value === true) {
        const outputMappings = executionStepControl.get(
          'outputMappings'
        ) as UntypedFormArray;
        outputMappings.controls.forEach((mappingControl) => {
          this.artifactMappingService.removeMappingTo(
            mappingControl as UntypedFormArray,
            step
          );
        });
      }
    });
    executionStepForm.removeAt(step);
  }

  getExecutionSteps(form: ExecutionStepsFormValueValid): ExecutionStep[] {
    return form.map((step) =>
      this.isMethodExecutionStepFormValue(step)
        ? new MethodExecutionStep(undefined, {
            module: step.module.name,
            method: step.method.name,
            outputMappings: step.outputMappings.map((output) =>
              this.artifactMappingService.getMappings(output)
            ),
            predefinedInput: step.predefinedInput,
          })
        : new EmptyExecutionStep(undefined, {
            name: step.name,
            description: step.description,
          })
    );
  }

  isMethodExecutionStepFormValue(
    step: ExecutionStepFormValue
  ): step is MethodExecutionStepFormValue {
    return step.isMethod;
  }
}
