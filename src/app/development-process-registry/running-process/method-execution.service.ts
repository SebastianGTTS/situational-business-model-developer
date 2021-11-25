import { Injectable } from '@angular/core';
import { RunningProcess } from './running-process';
import { StepArtifact } from './step-artifact';
import { ArtifactData, ArtifactDataReference, ArtifactDataType } from './artifact-data';
import { ModuleService } from '../module-api/module.service';
import { MetaModelService } from '../meta-model.service';
import { Router } from '@angular/router';
import { RunningMethod } from './running-method';
import { Artifact } from '../method-elements/artifact/artifact';
import { StepInputArtifact } from './step-input-artifact';
import { Decision } from '../bm-process/decision';
import { Step } from './step';
import { MethodExecutionOutput } from '../module-api/method-execution-output';
import { MethodExecutionInput } from '../module-api/method-execution-input';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';

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
  WRONG_ARTIFACT_TYPE = 'You can only delete reference artifacts',
}

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class MethodExecutionService {

  constructor(
    private metaModelService: MetaModelService,
    private moduleService: ModuleService,
    private router: Router,
  ) {
  }

  /**
   * Add a method to a running process that is executed out of the defined process
   *
   * @param runningProcess the running process
   * @param decision the method decisions
   */
  addMethod(runningProcess: RunningProcess, decision: Decision): void {
    runningProcess.addTodoMethod(new RunningMethod({
      decision,
      steps: decision.method.executionSteps.map(() => new Step({})),
    }));
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
  startMethodExecution(runningProcess: RunningProcess, nodeId: string): RunningMethod {
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
  startTodoMethodExecution(runningProcess: RunningProcess, executionId: string) {
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
    inputArtifactMapping: { artifact: number, version: number }[]
  ): void {
    const method = runningProcess.getRunningMethod(executionId);
    if (method == null) {
      throw new Error(MethodExecutionErrors.NOT_EXECUTING);
    }
    method.inputArtifacts = inputArtifactMapping.map((mapping) => {
      const artifact = runningProcess.artifacts[mapping.artifact];
      const version = artifact.versions[mapping.version];
      return new StepInputArtifact({
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
  isExecutionStepPrepared(runningProcess: RunningProcess, executionId: string): boolean {
    const method = runningProcess.getRunningMethod(executionId);
    return this._isExecutionStepPrepared(method);
  }

  /**
   * Check whether the next execution step is already prepared
   *
   * @param method the method to check
   * @return true if the execution step is already prepared
   */
  private _isExecutionStepPrepared(method: RunningMethod): boolean {
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
  async prepareExecuteStep(runningProcess: RunningProcess, executionId: string): Promise<void> {
    const method = runningProcess.getRunningMethod(executionId);
    if (method == null) {
      throw new Error(MethodExecutionErrors.NOT_EXECUTING);
    }
    if (!method.hasStepsLeft()) {
      throw new Error(MethodExecutionErrors.NO_STEPS_LEFT);
    }
    const currentStep = method.currentStep;
    const module = this.moduleService.getModule(currentStep.module);
    const moduleMethod = module.methods[currentStep.method];
    if (method.isPrepared()) {
      throw new Error(MethodExecutionErrors.ALREADY_PREPARED);
    }
    const stepInput = method.getStepArtifacts(method.currentStepNumber, moduleMethod.input.length);
    const stepArtifacts: StepArtifact[] = await this.copyStepArtifacts(stepInput);
    method.setInternalStepArtifacts(stepArtifacts);
  }

  /**
   * Execute a step of the currently running method
   *
   * @param runningProcess the running process
   * @param executionId the id of the executed method
   */
  async executeStep(runningProcess: RunningProcess, executionId: string): Promise<void> {
    const method = runningProcess.getRunningMethod(executionId);
    if (!this._isExecutionStepPrepared(method)) {
      throw new Error(MethodExecutionErrors.NOT_PREPARED);
    }
    const currentStep = method.currentStep;
    const module = this.moduleService.getModule(currentStep.module);
    const moduleMethodDefinition = module.methods[currentStep.method];
    const moduleService = module.service;
    const internalStepArtifacts = method.getInternalStepArtifacts();
    const input: MethodExecutionInput = {
      router: this.router,
      runningProcess,
      runningMethod: method,
      predefinedInput: method.currentStep.predefinedInput,
      inputStepArtifacts: internalStepArtifacts,
    };
    moduleService.executeMethod(moduleMethodDefinition.name, input);
  }

  /**
   * Finish the execution of a step
   *
   * @param runningProcess the running process
   * @param executionId the id of the executed method
   * @param step the step in the method
   * @param output the output of the method of the module
   */
  finishExecuteStep(runningProcess: RunningProcess, executionId: string, step: number, output: MethodExecutionOutput): void {
    const method = runningProcess.getRunningMethod(executionId);
    if (!this._isExecutionStepPrepared(method)) {
      throw new Error(MethodExecutionErrors.NOT_PREPARED);
    }
    if (method.currentStepNumber !== step) {
      throw new Error(MethodExecutionErrors.WRONG_STEP);
    }
    const currentStep = method.currentStep;
    const module = this.moduleService.getModule(currentStep.module);
    const moduleMethodDefinition = module.methods[currentStep.method];
    const artifacts = output.outputArtifactData;
    method.finishStepExecution(artifacts.map((artifactData, index) => new StepArtifact({
      artifact: new Artifact({
        metaModel: {
          name: undefined,
          type: moduleMethodDefinition.output[index].metaModelType,
        },
      }),
      data: artifactData,
    })));
    this.router.navigate(['runningprocess', 'runningprocessview', runningProcess._id, 'method', executionId]).then();
  }

  /**
   * Add the output artifacts
   *
   * @param runningProcess the running process
   * @param executionId the id of the executed method
   * @param outputArtifactsMapping the mapping of the artifacts
   */
  async addOutputArtifacts(
    runningProcess: RunningProcess,
    executionId: string,
    outputArtifactsMapping: { isDefinition: boolean, artifact: number, artifactName: string, data: ArtifactData }[]
  ): Promise<void> {
    const method = runningProcess.getRunningMethod(executionId);
    if (method == null) {
      throw new Error(MethodExecutionErrors.NOT_EXECUTING);
    }
    if (method.hasStepsLeft()) {
      throw new Error(MethodExecutionErrors.STEPS_LEFT);
    }
    const artifacts = method.getProcessOutputArtifacts();
    const methodOutputArtifacts = await this.copyStepArtifacts(method.getOutputArtifacts());
    for (let i = 0; i < methodOutputArtifacts.length; i++) {
      if (methodOutputArtifacts[i] != null) {
        outputArtifactsMapping[i].data = methodOutputArtifacts[i].data;
      }
    }
    runningProcess.addOutputArtifacts(executionId, artifacts, outputArtifactsMapping);
  }

  /**
   * Stop the execution of a method after it is finished
   *
   * @param runningProcess the running process
   * @param executionId the id of the executed method
   */
  async stopMethodExecution(runningProcess: RunningProcess, executionId: string): Promise<void> {
    const method = runningProcess.getRunningMethod(executionId);
    if (method == null) {
      throw new Error(MethodExecutionErrors.NOT_EXECUTING);
    }
    if (method.hasStepsLeft()) {
      throw new Error(MethodExecutionErrors.STEPS_LEFT);
    }
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
  async abortMethodExecution(runningProcess: RunningProcess, executionId: string): Promise<void> {
    const method = runningProcess.getRunningMethod(executionId);
    if (method == null) {
      throw new Error(MethodExecutionErrors.NOT_EXECUTING);
    }
    await this.removeUnusedArtifacts(method);
    runningProcess.removeRunningMethod(executionId);
  }

  /**
   * Removes an artifact reference
   *
   * @param artifact the artifact to remove
   */
  async removeArtifact(artifact: ArtifactData): Promise<void> {
    if (artifact.type !== ArtifactDataType.REFERENCE) {
      throw new Error(MethodExecutionErrors.WRONG_ARTIFACT_TYPE);
    }
    const reference: ArtifactDataReference = artifact.data;
    const api = this.metaModelService.getMetaModelApi(reference.type);
    try {
      await api.remove(reference);
    } catch (error) {
      if (error.status === 404 && error.name === 'not_found' && error.reason === 'deleted') {
        console.log(reference.id + ' (' + reference.type + ') already deleted');
      } else {
        throw error;
      }
    }
  }

  /**
   * Copy the step artifacts
   *
   * @param stepArtifacts the step artifacts
   * @return the copied step artifacts
   */
  private async copyStepArtifacts(stepArtifacts: StepArtifact[]): Promise<StepArtifact[]> {
    return Promise.all(stepArtifacts.map(async (artifact) => {
      if (artifact.data.type === ArtifactDataType.REFERENCE) {
        const reference: ArtifactDataReference = artifact.data.data;
        const api = this.metaModelService.getMetaModelApi(reference.type);
        return new StepArtifact({
          ...artifact,
          data: new ArtifactData({
            ...artifact.data,
            data: await api.copy(reference),
          }),
        });
      }
      return new StepArtifact(artifact);
    }));
  }

  /**
   * Remove all step artifacts in steps
   *
   * @param method the running method
   */
  private async removeUnusedArtifacts(method: RunningMethod): Promise<void> {
    const artifacts = method.getAllStepArtifacts();
    const toRemove = artifacts.filter((artifact) => artifact.data.type === ArtifactDataType.REFERENCE);
    for (const artifact of toRemove) {
      await this.removeArtifact(artifact.data);
    }
  }
}