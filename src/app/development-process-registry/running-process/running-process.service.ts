import { Injectable } from '@angular/core';
import { PouchdbService } from '../../database/pouchdb.service';
import PouchDB from 'pouchdb-browser';
import { RunningProcess } from './running-process';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import { BmProcess } from '../bm-process/bm-process';
import { ArtifactData, ArtifactDataType } from './artifact-data';
import { ProcessExecutionService } from './process-execution.service';
import { MethodExecutionService } from './method-execution.service';
import { Decision } from '../bm-process/decision';
import { MethodExecutionOutput } from '../module-api/method-execution-output';
import { StepInfo } from '../module-api/step-info';
import { MetaModelService } from '../meta-model.service';
import { Comment } from './comment';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule
})
export class RunningProcessService {

  constructor(
    private metaModelService: MetaModelService,
    private methodExecutionService: MethodExecutionService,
    private pouchdbService: PouchdbService,
    private processExecutionService: ProcessExecutionService,
  ) {
  }

  /**
   * Get the list of the running processes.
   */
  getRunningProcessesList() {
    return this.pouchdbService.find<RunningProcess>(RunningProcess.typeName, {
      selector: {},
    });
  }

  /**
   * Add new running process from a process.
   *
   * @param process the process from which to derive the running process
   * @param name the name of the running process
   */
  async addRunningProcess(process: BmProcess, name: string) {
    const runningProcess = new RunningProcess({
      name,
      process,
    });
    await this.processExecutionService.initRunningProcess(runningProcess);
    await this.processExecutionService.jumpToNextMethod(runningProcess);
    return this.saveRunningProcess(runningProcess);
  }

  /**
   * Get the running process.
   *
   * @param id id of the running process
   */
  async getRunningProcess(id: string): Promise<RunningProcess> {
    const e = await this.pouchdbService.get<RunningProcess>(id);
    return new RunningProcess(e);
  }

  /**
   * Execute a single common node
   *
   * @param runningProcess the running process
   * @param nodeId the id of the node to execute
   * @param flowId the flow id to take after the execution if it is an exclusive gateway
   */
  async executeStep(runningProcess: RunningProcess, nodeId: string = null, flowId: string = null) {
    const databaseProcess = await this.getRunningProcess(runningProcess._id);
    if (databaseProcess._rev !== runningProcess._rev) {
      throw new Error('Reload needed, process in database does not fit current process');
    }
    await this.processExecutionService.moveToNextStep(runningProcess, nodeId, flowId);
    return this.saveRunningProcess(runningProcess);
  }

  /**
   * Jump to next methods or decisions
   *
   * @param runningProcess the running process
   */
  async jumpSteps(runningProcess: RunningProcess) {
    const databaseProcess = await this.getRunningProcess(runningProcess._id);
    if (databaseProcess._rev !== runningProcess._rev) {
      throw new Error('Reload needed, process in database does not fit current process');
    }
    await this.processExecutionService.jumpToNextMethod(runningProcess);
    return this.saveRunningProcess(runningProcess);
  }

  /**
   * Start the execution of a method
   *
   * @param runningProcess the running process
   * @param nodeId the id of the node to execute
   */
  async startMethodExecution(runningProcess: RunningProcess, nodeId: string) {
    const databaseProcess = await this.getRunningProcess(runningProcess._id);
    if (databaseProcess._rev !== runningProcess._rev) {
      throw new Error('Reload needed, process in database does not fit current process');
    }
    if (!(await this.processExecutionService.canExecuteNode(runningProcess, nodeId))) {
      throw new Error('Can not execute node');
    }
    this.methodExecutionService.startMethodExecution(runningProcess, nodeId);
    return this.saveRunningProcess(runningProcess);
  }

  /**
   * Start the execution of a todomethod
   *
   * @param runningProcess the running process
   * @param executionId the execution id of the todomethod
   */
  async startTodoMethodExecution(runningProcess: RunningProcess, executionId: string) {
    const databaseProcess = await this.getRunningProcess(runningProcess._id);
    if (databaseProcess._rev !== runningProcess._rev) {
      throw new Error('Reload needed, process in database does not fit current process');
    }
    this.methodExecutionService.startTodoMethodExecution(runningProcess, executionId);
    return this.saveRunningProcess(runningProcess);
  }

  /**
   * Execute a step of the running method
   *
   * @param runningProcess the running process
   * @param executionId the id of the executed method
   */
  async executeMethodStep(runningProcess: RunningProcess, executionId: string) {
    const databaseProcess = await this.getRunningProcess(runningProcess._id);
    if (databaseProcess._rev !== runningProcess._rev) {
      throw new Error('Reload needed, process in database does not fit current process');
    }
    if (!this.methodExecutionService.isExecutionStepPrepared(runningProcess, executionId)) {
      await this.methodExecutionService.prepareExecuteStep(runningProcess, executionId);
      await this.saveRunningProcess(runningProcess);
      runningProcess = await this.getRunningProcess(runningProcess._id);
    }
    await this.methodExecutionService.executeStep(runningProcess, executionId);
    return this.saveRunningProcess(runningProcess);
  }

  /**
   * Finish the execution of a step. Called by a method of a module after the execution is finished.
   *
   * @param stepInfo the info about the running step
   * @param output the output of the method of the module
   */
  async finishExecuteStep(stepInfo: StepInfo, output: MethodExecutionOutput) {
    const databaseProcess = await this.getRunningProcess(stepInfo.runningProcessId);
    this.methodExecutionService.finishExecuteStep(databaseProcess, stepInfo.executionId, stepInfo.step, output);
    return this.saveRunningProcess(databaseProcess);
  }

  /**
   * Stop the execution of the current method
   *
   * @param runningProcess the running process
   * @param executionId the id of the executed method
   */
  async stopMethodExecution(runningProcess: RunningProcess, executionId: string) {
    const databaseProcess = await this.getRunningProcess(runningProcess._id);
    if (databaseProcess._rev !== runningProcess._rev) {
      throw new Error('Reload needed, process in database does not fit current process');
    }
    const nodeId = runningProcess.getRunningMethod(executionId).nodeId;
    await this.methodExecutionService.stopMethodExecution(runningProcess, executionId);
    if (nodeId != null) {
      await this.processExecutionService.moveToNextMethod(runningProcess, nodeId);
    }
    return this.saveRunningProcess(runningProcess);
  }

  /**
   * Abort the execution of the current method
   *
   * @param runningProcess the running process
   * @param executionId the id of the executed method
   */
  async abortMethodExecution(runningProcess: RunningProcess, executionId: string) {
    const databaseProcess = await this.getRunningProcess(runningProcess._id);
    if (databaseProcess._rev !== runningProcess._rev) {
      throw new Error('Reload needed, process in database does not fit current process');
    }
    await this.methodExecutionService.abortMethodExecution(runningProcess, executionId);
    return this.saveRunningProcess(runningProcess);
  }

  async getExecutableElements(runningProcess: RunningProcess): Promise<any[]> {
    return this.processExecutionService.getExecutableNodes(runningProcess);
  }

  /**
   * Get all decision nodes that are executable and need a decision
   *
   * @param runningProcess the running process
   * @return the decision nodes
   */
  async getExecutableDecisionNodes(runningProcess: RunningProcess): Promise<any[]> {
    return this.processExecutionService.getExecutableDecisionNodes(runningProcess);
  }

  /**
   * Get all executable method elements that are not already executed
   *
   * @param runningProcess the running process
   * @return a list of nodes which have methods that can be executed
   */
  async getExecutableMethods(runningProcess: RunningProcess): Promise<any[]> {
    const executableNodes = await this.processExecutionService.getExecutableNodes(runningProcess);
    const methods = executableNodes.filter((node) => runningProcess.isExecutable(node.id));
    return methods.filter((node) => runningProcess.getRunningMethodByNode(node.id) == null);
  }

  async setInputArtifacts(
    runningProcess: RunningProcess,
    executionId: string,
    inputArtifactMapping: { artifact: number, version: number }[],
  ) {
    const databaseProcess = await this.getRunningProcess(runningProcess._id);
    if (databaseProcess._rev !== runningProcess._rev) {
      throw new Error('Reload needed, process in database does not fit current process');
    }
    this.methodExecutionService.selectInputArtifacts(runningProcess, executionId, inputArtifactMapping);
    return this.saveRunningProcess(runningProcess);
  }

  async addOutputArtifacts(
    runningProcess: RunningProcess,
    executionId: string,
    outputArtifactsMapping: { isDefinition: boolean, artifact: number, artifactName: string, data: ArtifactData }[]
  ) {
    const databaseProcess = await this.getRunningProcess(runningProcess._id);
    if (databaseProcess._rev !== runningProcess._rev) {
      throw new Error('Reload needed, process in database does not fit current process');
    }
    await this.methodExecutionService.addOutputArtifacts(runningProcess, executionId, outputArtifactsMapping);
    return this.saveRunningProcess(runningProcess);
  }

  /**
   * Add a method to a running process that is executed out of the defined process
   *
   * @param runningProcess the running process
   * @param decision the method decisions
   */
  async addMethod(runningProcess: RunningProcess, decision: Decision) {
    const databaseProcess = await this.getRunningProcess(runningProcess._id);
    if (databaseProcess._rev !== runningProcess._rev) {
      throw new Error('Reload needed, process in database does not fit current process');
    }
    this.methodExecutionService.addMethod(runningProcess, decision);
    return this.saveRunningProcess(runningProcess);
  }

  /**
   * Remove a method from a running process that is executed out of the defined process
   *
   * @param runningProcess the running process
   * @param executionId the id of the method to remove
   */
  async removeMethod(runningProcess: RunningProcess, executionId: string) {
    const databaseProcess = await this.getRunningProcess(runningProcess._id);
    if (databaseProcess._rev !== runningProcess._rev) {
      throw new Error('Reload needed, process in database does not fit current process');
    }
    this.methodExecutionService.removeMethod(runningProcess, executionId);
    return this.saveRunningProcess(runningProcess);
  }

  /**
   * Remove the running process.
   *
   * @param id id of the running process
   */
  async deleteRunningProcess(id: string) {
    const result = await this.pouchdbService.get<RunningProcess>(id);
    const runningProcess = new RunningProcess(result);
    // abort all running methods
    runningProcess.runningMethods.forEach(
      (method) => this.methodExecutionService.abortMethodExecution(runningProcess, method.executionId)
    );
    // delete all referenced artifacts
    for (const artifact of runningProcess.artifacts) {
      for (const version of artifact.versions) {
        if (version.data.type === ArtifactDataType.REFERENCE) {
          await this.methodExecutionService.removeArtifact(version.data);
        }
      }
    }
    return this.pouchdbService.remove(result);
  }

  /**
   * Add a comment to a running method
   *
   * @param id the id of the running process
   * @param executionId the id of the method currently executed
   * @param comment the comment to add
   */
  async addComment(id: string, executionId: string, comment: Comment) {
    const process = await this.getRunningProcess(id);
    const method = process.getRunningMethod(executionId);
    method.addComment(comment);
    return this.saveRunningProcess(process);
  }

  /**
   * Update a comment of a running method
   *
   * @param id the id of the running process
   * @param executionId the id of the method currently executed
   * @param comment the comment to add
   */
  async updateComment(id: string, executionId: string, comment: Comment) {
    const process = await this.getRunningProcess(id);
    const method = process.getRunningMethod(executionId);
    const dbComment = method.getComment(comment.id);
    dbComment.update(comment);
    return this.saveRunningProcess(process);
  }

  /**
   * Add a comment from a running method
   *
   * @param id the id of the running process
   * @param executionId the id of the method currently executed
   * @param commentId the id of the comment to remove
   */
  async removeComment(id: string, executionId: string, commentId: string) {
    const process = await this.getRunningProcess(id);
    const method = process.getRunningMethod(executionId);
    method.removeComment(commentId);
    return this.saveRunningProcess(process);
  }

  private saveRunningProcess(runningProcess: RunningProcess): Promise<PouchDB.Core.Response> {
    return this.pouchdbService.put(runningProcess);
  }
}
