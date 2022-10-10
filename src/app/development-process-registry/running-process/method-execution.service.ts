import { Injectable } from '@angular/core';
import { RunningProcess } from './running-process';
import { StepArtifact } from './step-artifact';
import { ArtifactDataType } from './artifact-data';
import { ModuleService } from '../module-api/module.service';
import { Router } from '@angular/router';
import { RunningMethod } from './running-method';
import { StepInputArtifact } from './step-input-artifact';
import { MethodExecutionOutput } from '../module-api/method-execution-output';
import { MethodExecutionInput } from '../module-api/method-execution-input';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import { ArtifactDataService } from './artifact-data.service';
import { OutputArtifactMapping } from './output-artifact-mapping';
import {
  MethodDecision,
  MethodDecisionUpdate,
} from '../bm-process/method-decision';
import { isMethodExecutionStep } from '../development-method/execution-step';

export enum MethodExecutionErrors {
  NO_METHOD = 'The node has no method defined',
  NO_STEPS_LEFT = 'There are no steps left to be executed in the method',
  NOT_DEFINED = 'A method with this execution id is not in the todo list',
  NOT_EXECUTING = 'The execution id is currently not executed',
  NOT_PREPARED = 'The execution of this step is not yet prepared',
  ALREADY_EXECUTING = 'This node is currently already executed.',
  ALREADY_PREPARED = 'The execution of this step is already prepared',
  STEPS_LEFT = 'There are steps left in this method',
  WRONG_STEP = 'Trying to finish the wrong step',
  MISSING_OUTPUT = 'The output artifacts are not correctly mapped',
  MISSING_MODULE = 'A module is missing',
  MISSING_MODULE_METHOD = 'A module method is missing',
  MISSING_INPUT_ARTIFACT = 'The step can not be executed as an input artifact is missing',
  FINISH_TEXTUAL_METHOD = 'A textual method is automatically finished',
}

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class MethodExecutionService {
  constructor(
    private artifactDataService: ArtifactDataService,
    private moduleService: ModuleService,
    private router: Router
  ) {}

  /**
   * Add a method to a running process that is executed out of the defined process
   *
   * @param runningProcess the running process
   * @param decision the method decisions
   *
   * @return the added running method
   */
  addMethod(
    runningProcess: RunningProcess,
    decision: MethodDecision
  ): RunningMethod {
    return runningProcess.addTodoMethod(
      new RunningMethod(undefined, {
        decision,
        steps: decision.method.executionSteps.map(() => {
          return {};
        }),
      })
    );
  }

  /**
   * Update a method decision of a running process that is executed out of the defined process
   *
   * @param runningProcess the running process
   * @param executionId the execution id of the method to edit
   * @param decision the method decisions
   */
  updateMethodDecision(
    runningProcess: RunningProcess,
    executionId: string,
    decision: MethodDecisionUpdate
  ): void {
    const method = runningProcess.getTodoMethod(executionId);
    if (method == null) {
      throw new Error(MethodExecutionErrors.NOT_DEFINED);
    }
    method.decision.update(decision);
  }

  /**
   * Remove a method from a running process that is executed out of the defined process
   *
   * @param runningProcess the running process
   * @param executionId the id of the method to remove
   */
  removeMethod(runningProcess: RunningProcess, executionId: string): void {
    runningProcess.removeTodoMethod(executionId);
  }

  /**
   * Start the execution of a method
   * Does not check whether the node has enough tokens to be executed
   *
   * @param runningProcess the running process
   * @param nodeId the node id of the task which includes the method
   * @return the added running method
   */
  startMethodExecution(
    runningProcess: RunningProcess,
    nodeId: string
  ): RunningMethod {
    if (runningProcess.getRunningMethodByNode(nodeId) != null) {
      throw new Error(MethodExecutionErrors.ALREADY_EXECUTING);
    }
    if (!runningProcess.isExecutable(nodeId)) {
      throw new Error(MethodExecutionErrors.NO_METHOD);
    }
    return runningProcess.addRunningMethodOfProcess(nodeId);
  }

  /**
   * Start the execution of a todomethod
   *
   * @param runningProcess the running process
   * @param executionId the execution id of the todomethod
   */
  startTodoMethodExecution(
    runningProcess: RunningProcess,
    executionId: string
  ): void {
    const method = runningProcess.getTodoMethod(executionId);
    if (method == null) {
      throw new Error(MethodExecutionErrors.NOT_DEFINED);
    }
    runningProcess.addRunningMethod(method);
    runningProcess.removeTodoMethod(executionId);
  }

  /**
   * Select the input artifacts
   *
   * @param runningProcess the running process
   * @param executionId the id of the executed method
   * @param inputArtifactMapping the input artifact mapping
   */
  selectInputArtifacts(
    runningProcess: RunningProcess,
    executionId: string,
    inputArtifactMapping: {
      artifact: number | undefined;
      version: number | undefined;
    }[]
  ): void {
    const method = runningProcess.getRunningMethod(executionId);
    if (method == null) {
      throw new Error(MethodExecutionErrors.NOT_EXECUTING);
    }
    method.inputArtifacts = inputArtifactMapping.map((mapping) => {
      if (mapping.artifact == null || mapping.version == null) {
        return undefined;
      }
      const artifact = runningProcess.artifacts[mapping.artifact];
      const version = artifact.versions[mapping.version];
      return new StepInputArtifact(undefined, {
        metaModelType: artifact.artifact.metaModel?.type,
        identifier: artifact.identifier,
        artifact: artifact.artifact,
        data: version.data,
        versionInfo: {
          number: mapping.version,
          createdBy: version.createdBy,
          time: version.time,
        },
      });
    });
  }

  /**
   * Check whether the next execution step is already prepared
   *
   * @param runningProcess the running process
   * @param executionId the id of the executed method
   * @return true if the execution step is already prepared
   */
  isExecutionStepPrepared(
    runningProcess: RunningProcess,
    executionId: string
  ): boolean {
    const method = runningProcess.getRunningMethod(executionId);
    return this._isExecutionStepPrepared(method);
  }

  // noinspection JSMethodCanBeStatic
  /**
   * Check whether the next execution step is already prepared
   *
   * @param method the method to check
   * @return true if the execution step is already prepared
   */
  private _isExecutionStepPrepared(method: RunningMethod | undefined): boolean {
    if (method == null) {
      throw new Error(MethodExecutionErrors.NOT_EXECUTING);
    }
    if (!method.hasStepsLeft()) {
      throw new Error(MethodExecutionErrors.NO_STEPS_LEFT);
    }
    return method.isPrepared();
  }

  /**
   * Prepare the execution of a step of the currently running method
   *
   * @param runningProcess the running process
   * @param executionId the id of the executed method
   */
  async prepareExecuteStep(
    runningProcess: RunningProcess,
    executionId: string
  ): Promise<void> {
    const method = runningProcess.getRunningMethod(executionId);
    if (method == null) {
      throw new Error(MethodExecutionErrors.NOT_EXECUTING);
    }
    if (!method.hasStepsLeft()) {
      throw new Error(MethodExecutionErrors.NO_STEPS_LEFT);
    }
    if (method.isPrepared()) {
      throw new Error(MethodExecutionErrors.ALREADY_PREPARED);
    }
    const currentStep = method.currentStep;
    let stepInput: (StepArtifact | undefined)[];
    if (isMethodExecutionStep(currentStep)) {
      const moduleMethod = this.moduleService.getModuleMethod(
        currentStep.module,
        currentStep.method
      );
      if (moduleMethod == null) {
        throw new Error(MethodExecutionErrors.MISSING_MODULE_METHOD);
      }
      stepInput = method.getStepArtifacts(
        method.currentStepNumber,
        moduleMethod.input.length
      );
    } else {
      stepInput = [];
    }
    const stepArtifacts: (StepArtifact | undefined)[] =
      await this.copyStepArtifacts(stepInput);
    if (stepArtifacts.some((artifact) => artifact == null)) {
      throw new Error(MethodExecutionErrors.MISSING_INPUT_ARTIFACT);
    }
    method.setInternalStepArtifacts(stepArtifacts as StepArtifact[]);
  }

  /**
   * Execute a step of the currently running method
   *
   * @param runningProcess the running process
   * @param executionId the id of the executed method
   */
  async executeStep(
    runningProcess: RunningProcess,
    executionId: string
  ): Promise<void> {
    const method = runningProcess.getRunningMethod(executionId);
    if (!this._isExecutionStepPrepared(method) || method == null) {
      throw new Error(MethodExecutionErrors.NOT_PREPARED);
    }
    const currentStep = method.currentStep;
    if (isMethodExecutionStep(currentStep)) {
      const module = this.moduleService.getModule(currentStep.module);
      if (module == null) {
        throw new Error(MethodExecutionErrors.MISSING_MODULE);
      }
      const moduleMethodDefinition = module.methods[currentStep.method];
      const moduleService = module.service;
      const internalStepArtifacts = method.getInternalStepArtifacts();
      const input: MethodExecutionInput = {
        router: this.router,
        runningProcess,
        runningMethod: method,
        predefinedInput: currentStep.predefinedInput,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        inputStepArtifacts: internalStepArtifacts!,
      };
      moduleService.executeMethod(moduleMethodDefinition.name, input);
    } else {
      method.finishStepExecution([]);
    }
  }

  /**
   * Finish the execution of a step
   *
   * @param runningProcess the running process
   * @param executionId the id of the executed method
   * @param step the step in the method
   * @param output the output of the method of the module
   */
  finishExecuteStep(
    runningProcess: RunningProcess,
    executionId: string,
    step: number,
    output: MethodExecutionOutput
  ): void {
    const method = runningProcess.getRunningMethod(executionId);
    if (!this._isExecutionStepPrepared(method) || method == null) {
      throw new Error(MethodExecutionErrors.NOT_PREPARED);
    }
    if (method.currentStepNumber !== step) {
      throw new Error(MethodExecutionErrors.WRONG_STEP);
    }
    const currentStep = method.currentStep;
    if (isMethodExecutionStep(currentStep)) {
      const moduleMethodDefinition = this.moduleService.getModuleMethod(
        currentStep.module,
        currentStep.method
      );
      if (moduleMethodDefinition == null) {
        throw new Error(MethodExecutionErrors.MISSING_MODULE_METHOD);
      }
      const artifacts = output.outputArtifactData;
      method.finishStepExecution(
        artifacts.map(
          (artifactData, index) =>
            new StepArtifact(undefined, {
              metaModelType: moduleMethodDefinition.output[index].type,
              data: artifactData,
            })
        )
      );
      void this.router.navigate([
        'runningprocess',
        'runningprocessview',
        runningProcess._id,
        'method',
        executionId,
      ]);
    } else {
      throw new Error(MethodExecutionErrors.FINISH_TEXTUAL_METHOD);
    }
  }

  /**
   * Update the output artifact mapping of a method.
   *
   * @param runningProcess the running Process
   * @param executionId the id of the executed method
   * @param outputArtifacts the mapping of the artifacts
   */
  updateOutputArtifacts(
    runningProcess: RunningProcess,
    executionId: string,
    outputArtifacts: (OutputArtifactMapping | undefined)[]
  ): void {
    const method = runningProcess.getRunningMethod(executionId);
    if (method == null) {
      throw new Error(MethodExecutionErrors.NOT_EXECUTING);
    }
    method.updateOutputArtifacts(outputArtifacts);
  }

  /**
   * Add the output artifacts
   *
   * @param runningProcess the running process
   * @param executionId the id of the executed method
   * @param outputArtifactsMapping the mapping of the artifacts
   */
  private async addOutputArtifacts(
    runningProcess: RunningProcess,
    executionId: string,
    outputArtifactsMapping: (OutputArtifactMapping | undefined)[]
  ): Promise<void> {
    const method = runningProcess.getRunningMethod(executionId);
    if (method == null) {
      throw new Error(MethodExecutionErrors.NOT_EXECUTING);
    }
    if (method.hasStepsLeft()) {
      throw new Error(MethodExecutionErrors.STEPS_LEFT);
    }
    const artifacts = method.getProcessOutputArtifacts();
    const methodOutputArtifacts = await this.copyStepArtifacts(
      method.getOutputArtifacts()
    );
    for (let i = 0; i < methodOutputArtifacts.length; i++) {
      const methodOutputArtifact = methodOutputArtifacts[i];
      const outputArtifactMapping = outputArtifactsMapping[i];
      if (methodOutputArtifact != null && outputArtifactMapping != null) {
        outputArtifactMapping.data = methodOutputArtifact.data;
      }
    }
    runningProcess.addOutputArtifacts(
      executionId,
      artifacts,
      outputArtifactsMapping
    );
  }

  /**
   * Stop the execution of a method after it is finished
   *
   * @param runningProcess the running process
   * @param executionId the id of the executed method
   */
  async stopMethodExecution(
    runningProcess: RunningProcess,
    executionId: string
  ): Promise<void> {
    const method = runningProcess.getRunningMethod(executionId);
    if (method == null) {
      throw new Error(MethodExecutionErrors.NOT_EXECUTING);
    }
    if (method.hasStepsLeft()) {
      throw new Error(MethodExecutionErrors.STEPS_LEFT);
    }
    if (!method.hasOutputArtifactsCorrectlyDefined()) {
      throw new Error(MethodExecutionErrors.MISSING_OUTPUT);
    }
    await this.addOutputArtifacts(
      runningProcess,
      executionId,
      method.outputArtifacts ?? []
    );
    await this.removeUnusedArtifacts(method);
    runningProcess.addExecutedMethod({
      nodeId: method.nodeId,
      executionId: method.executionId,
      methodName: method.methodName,
      comments: method.comments,
    });
    runningProcess.removeRunningMethod(executionId);
  }

  /**
   * Abort the execution of a method
   *
   * @param runningProcess the running process
   * @param executionId the id of the executed method
   */
  async abortMethodExecution(
    runningProcess: RunningProcess,
    executionId: string
  ): Promise<void> {
    const method = runningProcess.getRunningMethod(executionId);
    if (method == null) {
      throw new Error(MethodExecutionErrors.NOT_EXECUTING);
    }
    await this.removeUnusedArtifacts(method);
    runningProcess.removeRunningMethod(executionId);
  }

  /**
   * Copy the step artifacts
   *
   * @param stepArtifacts the step artifacts
   * @return the copied step artifacts
   */
  private async copyStepArtifacts(
    stepArtifacts: (StepArtifact | undefined)[]
  ): Promise<(StepArtifact | undefined)[]> {
    return Promise.all(
      stepArtifacts.map(async (artifact) => {
        if (artifact == null) {
          return undefined;
        }
        if (artifact.data.type === ArtifactDataType.REFERENCE) {
          return new StepArtifact(undefined, {
            ...artifact,
            data: await this.artifactDataService.copy(artifact.data),
          });
        }
        return new StepArtifact(undefined, artifact);
      })
    );
  }

  /**
   * Remove all step artifacts in steps
   *
   * @param method the running method
   */
  private async removeUnusedArtifacts(method: RunningMethod): Promise<void> {
    const artifacts = method.getAllStepArtifacts();
    const toRemove = artifacts.filter(
      (artifact) => artifact.data.type === ArtifactDataType.REFERENCE
    );
    for (const artifact of toRemove) {
      await this.artifactDataService.remove(artifact.data);
    }
  }
}
