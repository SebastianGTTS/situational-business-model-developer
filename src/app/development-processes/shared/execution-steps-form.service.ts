import { Injectable } from '@angular/core';
import { Module } from '../../development-process-registry/module-api/module';
import { ExecutionStep } from '../../development-process-registry/development-method/execution-step';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModuleService } from '../../development-process-registry/module-api/module.service';
import { ArtifactMapping } from '../../development-process-registry/development-method/artifact-mapping';
import {
  ArtifactMappingFormService,
  MappingsFormValue,
} from './artifact-mapping-form.service';
import { ModuleMethod } from '../../development-process-registry/module-api/module-method';

export type ExecutionStepsFormValue = ExecutionStepFormValue[];

export interface ExecutionStepFormValue {
  module: Module;
  method: ModuleMethod;
  outputMappings: MappingsFormValue[];
  predefinedInput: any;
}

@Injectable({
  providedIn: 'root',
})
export class ExecutionStepsFormService {
  constructor(
    private artifactMappingService: ArtifactMappingFormService,
    private fb: FormBuilder,
    private moduleService: ModuleService
  ) {}

  createForm(executionSteps: ExecutionStep[]): FormArray {
    return this.fb.array(
      executionSteps.map((step) => this.createExecutionStepForm(step))
    );
  }

  createExecutionStepForm(executionStep: ExecutionStep = null): FormGroup {
    let module: Module = null;
    let method = null;
    if (executionStep) {
      module = this.moduleService.getModule(executionStep.module);
      method = module.methods[executionStep.method];
    }
    return this.fb.group({
      module: this.fb.control(module, Validators.required),
      method: this.fb.control(method, Validators.required),
      outputMappings: this.createMappingsForm(
        method,
        executionStep ? executionStep.outputMappings : null
      ),
      predefinedInput: this.createPredefinedInputForm(
        method,
        executionStep ? executionStep.predefinedInput : null
      ),
    });
  }

  createMappingsForm(
    method: ModuleMethod,
    outputMappings: ArtifactMapping[][]
  ): FormArray {
    let outputs = [];
    if (method) {
      outputs = method.output.map((output, index) => {
        let mappings = [];
        if (outputMappings && index < outputMappings.length) {
          mappings = outputMappings[index];
        }
        return this.artifactMappingService.createMappingsForm(mappings);
      });
    }
    return this.fb.array(outputs);
  }

  createPredefinedInputForm(
    method: ModuleMethod,
    predefinedInput: any
  ): FormGroup {
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
  addExecutionStep(executionStepForm: FormArray): void {
    executionStepForm.push(this.createExecutionStepForm());
  }

  /**
   * Called if the method of an execution step has changed.
   *
   * @param executionStepForm the execution step form
   * @param step the index of the step to remove
   */
  executionStepMethodChange(executionStepForm: FormArray, step: number): void {
    executionStepForm.controls.forEach((control) => {
      const outputMappings = control.get('outputMappings') as FormArray;
      outputMappings.controls.forEach((control: FormArray) => {
        this.artifactMappingService.resetMappingTo(control, step);
      });
    });
  }

  /**
   * Remove an execution step from the form and remove all mappings to it.
   *
   * @param executionStepForm the execution step form
   * @param step the index of the step to remove
   */
  removeExecutionStep(executionStepForm: FormArray, step: number): void {
    executionStepForm.controls.forEach((control) => {
      const outputMappings = control.get('outputMappings') as FormArray;
      outputMappings.controls.forEach((control: FormArray) => {
        this.artifactMappingService.removeMappingTo(control, step);
      });
    });
    executionStepForm.removeAt(step);
  }

  getExecutionSteps(form: ExecutionStepsFormValue): ExecutionStep[] {
    return form.map(
      (step) =>
        new ExecutionStep(undefined, {
          module: step.module ? step.module.name : null,
          method: step.method ? step.method.name : null,
          outputMappings: step.outputMappings.map((output) =>
            this.artifactMappingService.getMappings(output)
          ),
          predefinedInput: step.predefinedInput,
        })
    );
  }
}
