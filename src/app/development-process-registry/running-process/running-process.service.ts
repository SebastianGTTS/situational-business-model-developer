import { Injectable } from '@angular/core';
import { PouchdbService } from '../../database/pouchdb.service';
import {
  FullRunningProcess,
  RunningProcess,
  RunningProcessEntry,
  RunningProcessInit,
} from './running-process';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import { ArtifactData, ArtifactDataType } from './artifact-data';
import { ProcessExecutionService } from './process-execution.service';
import { MethodExecutionService } from './method-execution.service';
import { MethodExecutionOutput } from '../module-api/method-execution-output';
import { StepInfo } from '../module-api/step-info';
import { Comment } from './comment';
import { ArtifactDataService } from './artifact-data.service';
import { RunningArtifact } from './running-artifact';
import { DefaultElementService } from '../../database/default-element.service';
import { OutputArtifactMapping } from './output-artifact-mapping';
import {
  MethodDecision,
  MethodDecisionUpdate,
} from '../bm-process/method-decision';
import { EntryType } from '../../database/database-model-part';
import { BpmnFlowNode } from 'bpmn-js';
import { DbId } from '../../database/database-entry';
import { Artifact } from '../method-elements/artifact/artifact';
import { ProcessReference } from '../meta-model-definition';
import { Router } from '@angular/router';
import { ArtifactService } from '../method-elements/artifact/artifact.service';
import { ArtifactVersion, ArtifactVersionId } from './artifact-version';
import { Domain } from '../knowledge/domain';
import { Selection, SelectionInit } from '../development-method/selection';
import {
  SituationalFactor,
  SituationalFactorInit,
} from '../method-elements/situational-factor/situational-factor';
import { ContextChangeInfo } from './context-change-info';

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
    private artifactService: ArtifactService,
    protected methodExecutionService: MethodExecutionService,
    pouchdbService: PouchdbService,
    protected processExecutionService: ProcessExecutionService,
    private router: Router
  ) {
    super(pouchdbService);
  }

  async getList(): Promise<EntryType<RunningProcess>[]> {
    return this.pouchdbService.find<EntryType<RunningProcess>>(this.typeName, {
      selector: {
        contextChange: false,
      },
    });
  }

  /**
   * Add new running process from a process.
   *
   * @param element the running process
   */
  async add(element: RunningProcessInit): Promise<RunningProcess> {
    const runningProcess = new RunningProcess(undefined, element);
    if (runningProcess.hasProcess()) {
      await this.processExecutionService.initRunningProcess(runningProcess);
      await this.processExecutionService.jumpToNextMethod(runningProcess);
    }
    await this.save(runningProcess);
    return runningProcess;
  }

  /**
   * Execute a single common node
   *
   * @param runningProcess the running process
   * @param nodeId the id of the node to execute
   * @param flowId the flow id to take after the execution if it is an exclusive gateway
   */
  async executeStep(
    runningProcess: FullRunningProcess,
    nodeId: string,
    flowId?: string
  ): Promise<void> {
    try {
      const databaseProcess = await this.getWrite(runningProcess._id);
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
    } finally {
      this.freeWrite(runningProcess._id);
    }
  }

  /**
   * Jump to next methods or decisions
   *
   * @param runningProcess the running process
   */
  async jumpSteps(runningProcess: FullRunningProcess): Promise<void> {
    try {
      const databaseProcess = await this.getWrite(runningProcess._id);
      if (databaseProcess._rev !== runningProcess._rev) {
        throw new Error(
          'Reload needed, process in database does not fit current process'
        );
      }
      await this.processExecutionService.jumpToNextMethod(runningProcess);
      await this.save(runningProcess);
    } finally {
      this.freeWrite(runningProcess._id);
    }
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
    try {
      const databaseProcess = await this.getWrite(runningProcessId);
      if (!databaseProcess.hasProcess()) {
        throw new Error('Incorrect process type');
      }
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
    } finally {
      this.freeWrite(runningProcessId);
    }
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
    try {
      const databaseProcess = await this.getWrite(runningProcessId);
      this.methodExecutionService.startTodoMethodExecution(
        databaseProcess,
        executionId
      );
      await this.save(databaseProcess);
    } finally {
      this.freeWrite(runningProcessId);
    }
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
    try {
      const databaseProcess = await this.getWrite(runningProcess._id);
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
      await this.methodExecutionService.executeStep(
        runningProcess,
        executionId
      );
      await this.save(runningProcess);
    } finally {
      this.freeWrite(runningProcess._id);
    }
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
    if (
      stepInfo.runningProcessId == null ||
      stepInfo.executionId == null ||
      stepInfo.step == null
    ) {
      throw new Error(
        'Step info needs to specify runningProcessId, executionId and stepInfo to be used for finishing an execution step'
      );
    }
    try {
      const databaseProcess = await this.getWrite(stepInfo.runningProcessId);
      this.methodExecutionService.finishExecuteStep(
        databaseProcess,
        stepInfo.executionId,
        stepInfo.step,
        output
      );
      await this.save(databaseProcess);
    } finally {
      this.freeWrite(stepInfo.runningProcessId);
    }
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
    try {
      const databaseProcess = await this.getWrite(runningProcess._id);
      if (databaseProcess._rev !== runningProcess._rev) {
        throw new Error(
          'Reload needed, process in database does not fit current process'
        );
      }
      const nodeId = runningProcess.getRunningMethod(executionId)?.nodeId;
      await this.methodExecutionService.stopMethodExecution(
        runningProcess,
        executionId
      );
      if (runningProcess.hasProcess()) {
        if (nodeId != null) {
          await this.processExecutionService.moveToNextMethod(
            runningProcess,
            nodeId
          );
        }
      }
      await this.save(runningProcess);
    } finally {
      this.freeWrite(runningProcess._id);
    }
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
    try {
      const databaseProcess = await this.getWrite(runningProcess._id);
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
    } finally {
      this.freeWrite(runningProcess._id);
    }
  }

  async getExecutableElements(
    runningProcess: RunningProcess
  ): Promise<BpmnFlowNode[]> {
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
  ): Promise<BpmnFlowNode[]> {
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
  async getExecutableMethods(
    runningProcess: RunningProcess
  ): Promise<BpmnFlowNode[]> {
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
    inputArtifactMapping: {
      artifact: number | undefined;
      version: number | undefined;
    }[]
  ): Promise<void> {
    try {
      const databaseProcess = await this.getWrite(runningProcess._id);
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
    } finally {
      this.freeWrite(runningProcess._id);
    }
  }

  async updateOutputArtifacts(
    runningProcess: RunningProcess,
    executionId: string,
    outputArtifactsMapping: (OutputArtifactMapping | undefined)[]
  ): Promise<void> {
    try {
      const databaseProcess = await this.getWrite(runningProcess._id);
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
    } finally {
      this.freeWrite(runningProcess._id);
    }
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
    try {
      const runningProcess = await this.getWrite(runningProcessId);
      runningProcess.importArtifact(artifact);
      await this.save(runningProcess);
    } finally {
      this.freeWrite(runningProcessId);
    }
  }

  /**
   * Set context change of running process to true
   *
   * @param runningProcessId the id of the running process
   * @param comment comment from the method engineer why and what changes are necessary
   * @param domains suggested domains
   * @param situationalFactors suggested situationalFactors
   */
  async setContextChange(
    runningProcessId: string,
    comment: string,
    domains: Domain[],
    situationalFactors: Selection<SituationalFactor>[]
  ): Promise<void> {
    try {
      const runningProcess = await this.getWrite(runningProcessId);
      if (!runningProcess.hasProcess()) {
        throw new Error('Incorrect process type');
      }
      runningProcess.contextChange = true;
      runningProcess.contextChangeInfo = new ContextChangeInfo(undefined, {
        comment: comment,
        suggestedDomains: domains,
        suggestedSituationalFactors: situationalFactors,
        oldDomains: runningProcess.domains,
        oldSituationalFactors: runningProcess.situationalFactors,
      });
      await this.save(runningProcess);
    } finally {
      this.freeWrite(runningProcessId);
    }
  }

  /**
   * Add a method to a running process that is executed out of the defined process
   *
   * @param id running process id
   * @param decision the method decisions
   *
   * @return the executionId of the added method
   */
  async addMethod(id: DbId, decision: MethodDecision): Promise<string> {
    try {
      const runningProcess = await this.getWrite(id);
      const addedMethod = this.methodExecutionService.addMethod(
        runningProcess,
        decision
      );
      await this.save(runningProcess);
      return addedMethod.executionId;
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Update a method decision of a running process that is executed out of the defined process
   *
   * @param id running process id
   * @param executionId the execution id of the method to edit
   * @param decision the method decisions
   */
  async updateMethodDecision(
    id: DbId,
    executionId: string,
    decision: MethodDecisionUpdate
  ): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      this.methodExecutionService.updateMethodDecision(
        runningProcess,
        executionId,
        decision
      );
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
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
    try {
      const databaseProcess = await this.getWrite(runningProcess._id);
      if (databaseProcess._rev !== runningProcess._rev) {
        throw new Error(
          'Reload needed, process in database does not fit current process'
        );
      }
      this.methodExecutionService.removeMethod(runningProcess, executionId);
      await this.save(runningProcess);
    } finally {
      this.freeWrite(runningProcess._id);
    }
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
    try {
      const process = await this.getWrite(id);
      const method = process.getRunningMethod(executionId);
      if (method == null) {
        throw new Error(
          'Method with executionId ' + executionId + ' not found'
        );
      }
      method.addComment(comment);
      await this.save(process);
    } finally {
      this.freeWrite(id);
    }
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
    try {
      const process = await this.getWrite(id);
      const method = process.getRunningMethod(executionId);
      if (method == null) {
        throw new Error(
          'Method with executionId ' + executionId + ' not found'
        );
      }
      const dbComment = method.getComment(comment.id);
      if (dbComment == null) {
        throw new Error('Comment with id ' + comment.id + ' not found');
      }
      dbComment.update(comment);
      await this.save(process);
    } finally {
      this.freeWrite(id);
    }
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
    try {
      const process = await this.getWrite(id);
      const method = process.getRunningMethod(executionId);
      if (method == null) {
        throw new Error(
          'Method with executionId ' + executionId + ' not found'
        );
      }
      method.removeComment(commentId);
      await this.save(process);
    } finally {
      this.freeWrite(id);
    }
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
    try {
      const databaseProcess = await this.getWrite(runningProcess._id);
      if (databaseProcess._rev !== runningProcess._rev) {
        throw new Error(
          'Reload needed, process in database does not fit current process'
        );
      }
      runningProcess.renameArtifact(runningArtifact, identifier);
      await this.save(runningProcess);
    } finally {
      this.freeWrite(runningProcess._id);
    }
  }

  /**
   * Remove a running artifact from the running process
   *
   * @param id running process id
   * @param artifactId artifact's id
   */
  async removeArtifact(id: DbId, artifactId: DbId): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      runningProcess.removeArtifact(artifactId);
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Add an artifact to a running process
   *
   * @param id
   * @param artifact
   * @param outputArtifactMapping
   */
  async addArtifact(
    id: DbId,
    artifact: Artifact,
    outputArtifactMapping: OutputArtifactMapping
  ): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      runningProcess.addOutputArtifact(artifact, outputArtifactMapping);
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Create an internal artifact
   *
   * @param id
   * @param artifact
   */
  createInternalArtifact(id: DbId, artifact: Artifact): void {
    if (artifact.metaModel == null) {
      throw new Error('Artifact is missing a meta model');
    }
    const reference: ProcessReference = {
      referenceType: 'Process',
      runningProcessId: id,
    };
    this.artifactDataService.create(
      artifact.metaModel.type,
      reference,
      artifact._id
    );
  }

  /**
   * Add an internal artifact after creating it. Called by api methods from modules.
   *
   * @param id
   * @param artifactId
   * @param data
   */
  async addInternalArtifact(
    id: DbId,
    artifactId: DbId,
    data: ArtifactData
  ): Promise<void> {
    const artifact = await this.artifactService.get(artifactId);
    if (artifact.metaModel == null) {
      throw new Error('Artifact is missing a meta model');
    }
    try {
      const runningProcess = await this.getWrite(id);
      const outputArtifactMapping = new OutputArtifactMapping(undefined, {
        data: data,
        isDefinition: true,
        artifactName:
          (await this.artifactDataService.getName(
            artifact.metaModel.type,
            data
          )) ?? 'Missing name',
      });
      runningProcess.addOutputArtifact(artifact, outputArtifactMapping, true);
      await this.save(runningProcess);
      if (runningProcess.contextChange) {
        await this.router.navigate([
          'bmprocess',
          'contextchange',
          runningProcess._id,
        ]);
      } else {
        await this.router.navigate([
          'runningprocess',
          'runningprocessview',
          runningProcess._id,
        ]);
      }
    } finally {
      this.freeWrite(id);
    }
  }

  async viewInternalArtifact(
    id: DbId,
    versionId: ArtifactVersionId
  ): Promise<void> {
    const runningProcess = await this.get(id);
    const version = runningProcess.getArtifactVersion(versionId);
    if (version == null) {
      throw new Error(
        'Running Process does not contain a version with the versionId'
      );
    }
    this.artifactDataService.view(version.data, {
      referenceType: 'Process',
      runningProcessId: runningProcess._id,
      artifactVersionId: version.id,
    });
  }

  async editInternalArtifact(
    runningProcess: RunningProcess,
    artifact: RunningArtifact
  ): Promise<void> {
    try {
      const databaseProcess = await this.getWrite(runningProcess._id);
      if (databaseProcess._rev !== runningProcess._rev) {
        throw new Error(
          'Reload needed, process in database does not fit current process'
        );
      }
      if (runningProcess.artifacts.indexOf(artifact) === -1) {
        throw new Error('Artifact is not from the running process');
      }
      const latestVersion = artifact.getLatestVersion();
      if (latestVersion == null) {
        throw new Error('Artifact without versions');
      }
      let editVersion: ArtifactVersion;
      if (latestVersion.editing) {
        editVersion = latestVersion;
      } else {
        artifact.addVersion({
          createdBy: 'added',
          data: await this.artifactDataService.copy(latestVersion.data),
          editing: true,
        });
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        editVersion = artifact.getLatestVersion()!;
        await this.save(runningProcess);
      }
      this.artifactDataService.edit(editVersion.data, {
        referenceType: 'Process',
        runningProcessId: runningProcess._id,
        artifactVersionId: editVersion.id,
      });
    } finally {
      this.freeWrite(runningProcess._id);
    }
  }

  /**
   * Finish editing an internal artifact
   *
   * @param id
   * @param artifactVersionId
   */
  async finishEditInternalArtifact(
    id: DbId,
    artifactVersionId: ArtifactVersionId
  ): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      const version = runningProcess.getArtifactVersion(artifactVersionId);
      if (version == null) {
        throw new Error(
          'Running Process does not contain a version with the versionId'
        );
      }
      if (!version.editing) {
        throw new Error('Version currently not editable');
      }
      version.editing = false;
      await this.save(runningProcess);
      if (runningProcess.contextChange) {
        await this.router.navigate([
          'bmprocess',
          'contextchange',
          runningProcess._id,
        ]);
      } else {
        await this.router.navigate([
          'runningprocess',
          'runningprocessview',
          runningProcess._id,
        ]);
      }
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Updates the real domains for light processes.
   * Should not be called with full processes.
   *
   * @param id
   * @param domains
   */
  async updateDomains(id: DbId, domains: Domain[]): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      if (runningProcess.hasProcess()) {
        throw new Error('Incorrect process type');
      }
      runningProcess._domains = domains;
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Updates the real factors for light processes.
   * Should not be called with full processes.
   *
   * @param id
   * @param situationalFactors
   */
  async updateSituationalFactors(
    id: DbId,
    situationalFactors: SelectionInit<SituationalFactorInit>[]
  ): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      if (runningProcess.hasProcess()) {
        throw new Error('Incorrect process type');
      }
      runningProcess._situationalFactors = situationalFactors.map(
        (selection) =>
          new Selection<SituationalFactor>(
            undefined,
            selection,
            SituationalFactor
          )
      );
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }
}
