import { Injectable } from '@angular/core';
import { Module } from '../../development-process-registry/module-api/module';
import { ExecutionStep } from '../../development-process-registry/development-method/execution-step';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModuleService } from '../../development-process-registry/module-api/module.service';
import { ArtifactMapping } from '../../development-process-registry/development-method/artifact-mapping';
import {
  ArtifactMappingFormService,
  MappingFormValue,
} from './artifact-mapping-form.service';
import { ModuleMethod } from '../../development-process-registry/module-api/module-method';

export interface ExecutionStepsFormValue {
  module: Module;
  method: ModuleMethod;
  outputMappings: MappingFormValue[][];
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

  getExecutionSteps(form: ExecutionStepsFormValue[]): ExecutionStep[] {
    return form.map(
      (step) =>
        new ExecutionStep({
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
