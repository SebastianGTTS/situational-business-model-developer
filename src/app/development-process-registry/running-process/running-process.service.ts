import { Injectable } from '@angular/core';
import { PouchdbService } from '../../database/pouchdb.service';
import {
  RunningProcess,
  RunningProcessEntry,
  RunningProcessInit,
} from './running-process';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import { ArtifactDataType } from './artifact-data';
import { ProcessExecutionService } from './process-execution.service';
import { MethodExecutionService } from './method-execution.service';
import { Decision } from '../bm-process/decision';
import { MethodExecutionOutput } from '../module-api/method-execution-output';
import { StepInfo } from '../module-api/step-info';
import { Comment } from './comment';
import { ArtifactDataService } from './artifact-data.service';
import { RunningArtifact } from './running-artifact';
import { DefaultElementService } from '../../database/default-element.service';
import { OutputArtifactMapping } from './output-artifact-mapping';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class RunningProcessService extends DefaultElementService<
  RunningProcess,
  RunningProcessInit
> {
  protected readonly typeName = RunningProcess.typeName;

  protected readonly elementConstructor = RunningProcess;

  constructor(
    private artifactDataService: ArtifactDataService,
    private methodExecutionService: MethodExecutionService,
    pouchdbService: PouchdbService,
    private processExecutionService: ProcessExecutionService
  ) {
    super(pouchdbService);
  }

  /**
   * Add new running process from a process.
   *
   * @param element the running process
   */
  async add(element: RunningProcessInit): Promise<void> {
    const runningProcess = new RunningProcess(undefined, element);
    await this.processExecutionService.initRunningProcess(runningProcess);
    await this.processExecutionService.jumpToNextMethod(runningProcess);
    await this.save(runningProcess);
  }

  /**
   * Execute a single common node
   *
   * @param runningProcess the running process
   * @param nodeId the id of the node to execute
   * @param flowId the flow id to take after the execution if it is an exclusive gateway
   */
  async executeStep(
    runningProcess: RunningProcess,
    nodeId: string = null,
    flowId: string = null
  ): Promise<void> {
    const databaseProcess = await this.get(runningProcess._id);
    if (databaseProcess._rev !== runningProcess._rev) {
      throw new Error(
        'Reload needed, process in database does not fit current process'
      );
    }
    await this.processExecutionService.moveToNextStep(
      runningProcess,
      nodeId,
      flowId
    );
    await this.save(runningProcess);
  }

  /**
   * Jump to next methods or decisions
   *
   * @param runningProcess the running process
   */
  async jumpSteps(runningProcess: RunningProcess): Promise<void> {
    const databaseProcess = await this.get(runningProcess._id);
    if (databaseProcess._rev !== runningProcess._rev) {
      throw new Error(
        'Reload needed, process in database does not fit current process'
      );
    }
    await this.processExecutionService.jumpToNextMethod(runningProcess);
    await this.save(runningProcess);
  }

  /**
   * Start the execution of a method
   *
   * @param runningProcessId the id of the running process
   * @param nodeId the id of the node to execute
   */
  async startMethodExecution(
    runningProcessId: string,
    nodeId: string
  ): Promise<void> {
    const databaseProcess = await this.get(runningProcessId);
    if (
      !(await this.processExecutionService.canExecuteNode(
        databaseProcess,
        nodeId
      ))
    ) {
      throw new Error('Can not execute node');
    }
    this.methodExecutionService.startMethodExecution(databaseProcess, nodeId);
    await this.save(databaseProcess);
  }

  /**
   * Start the execution of a todomethod
   *
   * @param runningProcessId the id of the running process
   * @param executionId the execution id of the todomethod
   */
  async startTodoMethodExecution(
    runningProcessId: string,
    executionId: string
  ): Promise<void> {
    const databaseProcess = await this.get(runningProcessId);
    this.methodExecutionService.startTodoMethodExecution(
      databaseProcess,
      executionId
    );
    await this.save(databaseProcess);
  }

  /**
   * Execute a step of the running method
   *
   * @param runningProcess the running process
   * @param executionId the id of the executed method
   */
  async executeMethodStep(
    runningProcess: RunningProcess,
    executionId: string
  ): Promise<void> {
    const databaseProcess = await this.get(runningProcess._id);
    if (databaseProcess._rev !== runningProcess._rev) {
      throw new Error(
        'Reload needed, process in database does not fit current process'
      );
    }
    if (
      !this.methodExecutionService.isExecutionStepPrepared(
        runningProcess,
        executionId
      )
    ) {
      await this.methodExecutionService.prepareExecuteStep(
        runningProcess,
        executionId
      );
      await this.save(runningProcess);
      runningProcess = await this.get(runningProcess._id);
    }
    await this.methodExecutionService.executeStep(runningProcess, executionId);
    await this.save(runningProcess);
  }

  /**
   * Finish the execution of a step. Called by a method of a module after the execution is finished.
   *
   * @param stepInfo the info about the running step
   * @param output the output of the method of the module
   */
  async finishExecuteStep(
    stepInfo: StepInfo,
    output: MethodExecutionOutput
  ): Promise<void> {
    const databaseProcess = await this.get(stepInfo.runningProcessId);
    this.methodExecutionService.finishExecuteStep(
      databaseProcess,
      stepInfo.executionId,
      stepInfo.step,
      output
    );
    await this.save(databaseProcess);
  }

  /**
   * Stop the execution of the current method
   *
   * @param runningProcess the running process
   * @param executionId the id of the executed method
   */
  async stopMethodExecution(
    runningProcess: RunningProcess,
    executionId: string
  ): Promise<void> {
    const databaseProcess = await this.get(runningProcess._id);
    if (databaseProcess._rev !== runningProcess._rev) {
      throw new Error(
        'Reload needed, process in database does not fit current process'
      );
    }
    const nodeId = runningProcess.getRunningMethod(executionId).nodeId;
    await this.methodExecutionService.stopMethodExecution(
      runningProcess,
      executionId
    );
    if (nodeId != null) {
      await this.processExecutionService.moveToNextMethod(
        runningProcess,
        nodeId
      );
    }
    await this.save(runningProcess);
  }

  /**
   * Abort the execution of the current method
   *
   * @param runningProcess the running process
   * @param executionId the id of the executed method
   */
  async abortMethodExecution(
    runningProcess: RunningProcess,
    executionId: string
  ): Promise<void> {
    const databaseProcess = await this.get(runningProcess._id);
    if (databaseProcess._rev !== runningProcess._rev) {
      throw new Error(
        'Reload needed, process in database does not fit current process'
      );
    }
    await this.methodExecutionService.abortMethodExecution(
      runningProcess,
      executionId
    );
    await this.save(runningProcess);
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
  async getExecutableDecisionNodes(
    runningProcess: RunningProcess
  ): Promise<any[]> {
    return this.processExecutionService.getExecutableDecisionNodes(
      runningProcess
    );
  }

  /**
   * Get all executable method elements that are not already executed
   *
   * @param runningProcess the running process
   * @return a list of nodes which have methods that can be executed
   */
  async getExecutableMethods(runningProcess: RunningProcess): Promise<any[]> {
    const executableNodes =
      await this.processExecutionService.getExecutableNodes(runningProcess);
    const methods = executableNodes.filter((node) =>
      runningProcess.isExecutable(node.id)
    );
    return methods.filter(
      (node) => runningProcess.getRunningMethodByNode(node.id) == null
    );
  }

  async setInputArtifacts(
    runningProcess: RunningProcess,
    executionId: string,
    inputArtifactMapping: { artifact: number; version: number }[]
  ): Promise<void> {
    const databaseProcess = await this.get(runningProcess._id);
    if (databaseProcess._rev !== runningProcess._rev) {
      throw new Error(
        'Reload needed, process in database does not fit current process'
      );
    }
    this.methodExecutionService.selectInputArtifacts(
      databaseProcess,
      executionId,
      inputArtifactMapping
    );
    await this.save(databaseProcess);
  }

  async updateOutputArtifacts(
    runningProcess: RunningProcess,
    executionId: string,
    outputArtifactsMapping: OutputArtifactMapping[]
  ): Promise<void> {
    const databaseProcess = await this.get(runningProcess._id);
    if (databaseProcess._rev !== runningProcess._rev) {
      throw new Error(
        'Reload needed, process in database does not fit current process'
      );
    }
    this.methodExecutionService.updateOutputArtifacts(
      databaseProcess,
      executionId,
      outputArtifactsMapping
    );
    await this.save(databaseProcess);
  }

  /**
   * Import an artifact into a process
   *
   * @param runningProcessId the id of the running process
   * @param artifact the artifact to import into the running process
   */
  async importArtifact(
    runningProcessId: string,
    artifact: RunningArtifact
  ): Promise<void> {
    const runningProcess = await this.get(runningProcessId);
    runningProcess.importArtifact(artifact);
    await this.save(runningProcess);
  }

  /**
   * Add a method to a running process that is executed out of the defined process
   *
   * @param runningProcess the running process
   * @param decision the method decisions
   */
  async addMethod(
    runningProcess: RunningProcess,
    decision: Decision
  ): Promise<void> {
    const databaseProcess = await this.get(runningProcess._id);
    if (databaseProcess._rev !== runningProcess._rev) {
      throw new Error(
        'Reload needed, process in database does not fit current process'
      );
    }
    this.methodExecutionService.addMethod(runningProcess, decision);
    await this.save(runningProcess);
  }

  /**
   * Remove a method from a running process that is executed out of the defined process
   *
   * @param runningProcess the running process
   * @param executionId the id of the method to remove
   */
  async removeMethod(
    runningProcess: RunningProcess,
    executionId: string
  ): Promise<void> {
    const databaseProcess = await this.get(runningProcess._id);
    if (databaseProcess._rev !== runningProcess._rev) {
      throw new Error(
        'Reload needed, process in database does not fit current process'
      );
    }
    this.methodExecutionService.removeMethod(runningProcess, executionId);
    await this.save(runningProcess);
  }

  /**
   * Remove the running process.
   *
   * @param id id of the running process
   */
  async delete(id: string): Promise<void> {
    const result = await this.pouchdbService.get<RunningProcessEntry>(id);
    const runningProcess = new RunningProcess(result, undefined);
    // abort all running methods
    runningProcess.runningMethods.forEach((method) =>
      this.methodExecutionService.abortMethodExecution(
        runningProcess,
        method.executionId
      )
    );
    // delete all referenced artifacts
    for (const artifact of runningProcess.artifacts) {
      for (const version of artifact.versions) {
        if (version.data.type === ArtifactDataType.REFERENCE) {
          await this.artifactDataService.remove(version.data);
        }
      }
    }
    await this.pouchdbService.remove(result);
  }

  /**
   * Add a comment to a running method
   *
   * @param id the id of the running process
   * @param executionId the id of the method currently executed
   * @param comment the comment to add
   */
  async addComment(
    id: string,
    executionId: string,
    comment: Comment
  ): Promise<void> {
    const process = await this.get(id);
    const method = process.getRunningMethod(executionId);
    method.addComment(comment);
    await this.save(process);
  }

  /**
   * Update a comment of a running method
   *
   * @param id the id of the running process
   * @param executionId the id of the method currently executed
   * @param comment the comment to add
   */
  async updateComment(
    id: string,
    executionId: string,
    comment: Comment
  ): Promise<void> {
    const process = await this.get(id);
    const method = process.getRunningMethod(executionId);
    const dbComment = method.getComment(comment.id);
    dbComment.update(comment);
    await this.save(process);
  }

  /**
   * Add a comment from a running method
   *
   * @param id the id of the running process
   * @param executionId the id of the method currently executed
   * @param commentId the id of the comment to remove
   */
  async removeComment(
    id: string,
    executionId: string,
    commentId: string
  ): Promise<void> {
    const process = await this.get(id);
    const method = process.getRunningMethod(executionId);
    method.removeComment(commentId);
    await this.save(process);
  }

  /**
   * Change a running artifact's identifier
   *
   * @param runningProcess the running process
   * @param runningArtifact the running artifact to change
   * @param identifier the new identifier
   */
  async renameArtifact(
    runningProcess: RunningProcess,
    runningArtifact: RunningArtifact,
    identifier: string
  ): Promise<void> {
    const databaseProcess = await this.get(runningProcess._id);
    if (databaseProcess._rev !== runningProcess._rev) {
      throw new Error(
        'Reload needed, process in database does not fit current process'
      );
    }
    runningProcess.renameArtifact(runningArtifact, identifier);
    await this.save(runningProcess);
  }
}
