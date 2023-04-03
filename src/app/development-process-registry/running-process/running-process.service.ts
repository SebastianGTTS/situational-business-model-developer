import { Injectable } from '@angular/core';
import { PouchdbService } from '../../database/pouchdb.service';
import {
  RunningProcess,
  RunningProcessEntry,
  RunningProcessInit,
} from './running-process';
import { ArtifactData, ArtifactDataType } from './artifact-data';
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
import {
  DatabaseConstructor,
  EntryType,
} from '../../database/database-model-part';
import { DatabaseRevision, DbId } from '../../database/database-entry';
import { Artifact } from '../method-elements/artifact/artifact';
import { ProcessReference } from '../meta-artifact-definition';
import { Router } from '@angular/router';
import { ArtifactService } from '../method-elements/artifact/artifact.service';
import { ArtifactVersion, ArtifactVersionId } from './artifact-version';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import {
  isRunningPatternProcessEntry,
  RunningPatternProcess,
} from './running-pattern-process';
import {
  isRunningPhaseProcessEntry,
  RunningPhaseProcess,
} from './running-phase-process';
import {
  isRunningLightProcessEntry,
  RunningLightProcess,
} from './running-light-process';
import { IconInit } from '../../model/icon';

@Injectable()
export abstract class RunningProcessServiceBase<
  T extends RunningProcess,
  S extends RunningProcessInit
> extends DefaultElementService<T, S> {
  protected readonly typeName = RunningProcess.typeName;

  protected constructor(
    private artifactDataService: ArtifactDataService,
    private artifactService: ArtifactService,
    protected methodExecutionService: MethodExecutionService,
    pouchdbService: PouchdbService,
    protected router: Router
  ) {
    super(pouchdbService);
  }

  async getList(): Promise<EntryType<T>[]> {
    return this.pouchdbService.find<EntryType<T>>(this.typeName, {
      selector: {
        $not: {
          $or: [{ contextChange: true }, { completed: true }],
        },
      },
    });
  }

  /**
   * Update the info of a running process
   *
   * @param id
   * @param name
   * @param description
   */
  async updateInfo(id: DbId, name: string, description: string): Promise<void> {
    try {
      const dbProcess = await this.getWrite(id);
      dbProcess.updateInfo(name, description);
      await this.save(dbProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Update the icon of a running process
   *
   * @param id
   * @param icon
   */
  async updateIcon(id: DbId, icon: IconInit): Promise<void> {
    try {
      const dbProcess = await this.getWrite(id);
      dbProcess.updateIcon(icon);
      await this.save(dbProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Start the execution of a todomethod
   *
   * @param runningProcessId the id of the running process
   * @param executionId the execution id of the todomethod
   */
  async startTodoMethodExecution(
    runningProcessId: DbId,
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
   * @param id the id of the running process
   * @param executionId the id of the executed method
   */
  async executeMethodStep(id: DbId, executionId: string): Promise<void> {
    try {
      let runningProcess = await this.getWrite(id);
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
      this.freeWrite(id);
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
   * @param id the id of the running process
   * @param executionId the id of the executed method
   * @return whether there are executable methods left
   */
  async stopMethodExecution(id: DbId, executionId: string): Promise<boolean> {
    try {
      const runningProcess = await this.getWrite(id);
      const nodeId = runningProcess.getRunningMethod(executionId)?.nodeId;
      await this.methodExecutionService.stopMethodExecution(
        runningProcess,
        executionId
      );
      if (nodeId != null) {
        await this.moveToNextMethod?.(runningProcess, nodeId);
      }
      await this.save(runningProcess);
      return await this.hasExecutableMethodsLeft(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Called after a method is finished successfully to allow the underlying
   * process to mark the method as executed and mark the next method as ready.
   *
   * @param runningProcess
   * @param nodeId
   * @protected
   */
  protected async moveToNextMethod?(
    runningProcess: T,
    nodeId: string
  ): Promise<void>;

  /**
   * Checks whether the running process has executable methods left. Should be
   * overridden by subclasses that add possible executable methods but do not
   * add them to the array.
   *
   * @param runningProcess
   * @protected
   */
  protected async hasExecutableMethodsLeft(
    runningProcess: T
  ): Promise<boolean> {
    return runningProcess.todoMethods.length > 0;
  }

  /**
   * Abort the execution of the current method
   *
   * @param id the id of the running process
   * @param executionId the id of the executed method
   */
  async abortMethodExecution(id: DbId, executionId: string): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      await this.methodExecutionService.abortMethodExecution(
        runningProcess,
        executionId
      );
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  async setInputArtifacts(
    id: DbId,
    executionId: string,
    inputArtifactMapping: {
      artifact: number | undefined;
      version: number | undefined;
    }[]
  ): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      this.methodExecutionService.selectInputArtifacts(
        runningProcess,
        executionId,
        inputArtifactMapping
      );
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  async updateOutputArtifacts(
    id: DbId,
    executionId: string,
    outputArtifactsMapping: (OutputArtifactMapping | undefined)[]
  ): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      this.methodExecutionService.updateOutputArtifacts(
        runningProcess,
        executionId,
        outputArtifactsMapping
      );
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Import an artifact into a process
   *
   * @param runningProcessId the id of the running process
   * @param artifact the artifact to import into the running process
   */
  async importArtifact(
    runningProcessId: DbId,
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
   * @param id running process id
   * @param executionId the id of the method to remove
   */
  async removeMethod(id: DbId, executionId: string): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      this.methodExecutionService.removeMethod(runningProcess, executionId);
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Remove the running process.
   *
   * @param id id of the running process
   */
  async delete(id: DbId): Promise<void> {
    const result = await this.pouchdbService.get<EntryType<T>>(id);
    const runningProcess = new this.elementConstructor(result, undefined);
    // abort all running methods
    for (const method of runningProcess.runningMethods) {
      await this.methodExecutionService.abortMethodExecution(
        runningProcess,
        method.executionId
      );
    }
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
    id: DbId,
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
    id: DbId,
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
    id: DbId,
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
   * @param id the id of the running process
   * @param runningArtifactId the id of the running artifact to change
   * @param identifier the new identifier
   */
  async renameArtifact(
    id: DbId,
    runningArtifactId: DbId,
    identifier: string
  ): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      runningProcess.renameArtifact(runningArtifactId, identifier);
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
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
    if (artifact.metaArtifact == null) {
      throw new Error('Artifact is missing a meta artifact');
    }
    const reference: ProcessReference = {
      referenceType: 'Process',
      runningProcessId: id,
    };
    this.artifactDataService.create(
      artifact.metaArtifact.type,
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
    if (artifact.metaArtifact == null) {
      throw new Error('Artifact is missing a meta artifact');
    }
    try {
      const runningProcess = await this.getWrite(id);
      const outputArtifactMapping = new OutputArtifactMapping(undefined, {
        data: data,
        isDefinition: true,
        artifactName:
          (await this.artifactDataService.getName(
            artifact.metaArtifact.type,
            data
          )) ?? 'Missing name',
      });
      runningProcess.addOutputArtifact(artifact, outputArtifactMapping, true);
      await this.save(runningProcess);
      await this.navigateToRunningProcess(runningProcess);
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
    runningProcessId: DbId,
    artifactId: DbId
  ): Promise<void> {
    try {
      const runningProcess = await this.getWrite(runningProcessId);
      const artifact = runningProcess.artifacts.find(
        (a) => a._id === artifactId
      );
      if (artifact == null) {
        throw new Error('Artifact does not exist');
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
      this.freeWrite(runningProcessId);
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
      await this.navigateToRunningProcess(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  async finishRunningProcess(id: DbId, conclusion: string): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      runningProcess.finish(conclusion);
      // abort all running methods
      for (const method of runningProcess.runningMethods) {
        await this.methodExecutionService.abortMethodExecution(
          runningProcess,
          method.executionId
        );
      }
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  protected async navigateToRunningProcess(runningProcess: T): Promise<void> {
    await this.router.navigate([
      'runningprocess',
      'runningprocessview',
      runningProcess._id,
    ]);
  }

  async getWrite(id: DbId): Promise<T> {
    const runningProcess = await super.getWrite(id);
    if (runningProcess.completed) {
      throw new Error('Can not edit completed running process');
    }
    return runningProcess;
  }
}

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class RunningProcessService extends RunningProcessServiceBase<
  RunningProcess,
  RunningProcessInit
> {
  protected get elementConstructor(): DatabaseConstructor<
    RunningProcess,
    RunningProcessInit
  > {
    throw new Error('Not implemented');
  }

  async add(): Promise<RunningProcess> {
    throw new Error('Not implemented. Use RunningProcessTypesService instead.');
  }

  async get(id: DbId): Promise<RunningProcess & DatabaseRevision> {
    const entry = await this.pouchdbService.get<EntryType<RunningProcess>>(id);
    let runningProcess: RunningProcess;
    if (isRunningPatternProcessEntry(entry)) {
      runningProcess = new RunningPatternProcess(entry, undefined);
    } else if (isRunningPhaseProcessEntry(entry)) {
      runningProcess = new RunningPhaseProcess(entry, undefined);
    } else if (isRunningLightProcessEntry(entry)) {
      runningProcess = new RunningLightProcess(entry, undefined);
    } else {
      throw new Error('Unknown running process type');
    }
    return runningProcess as RunningProcess & DatabaseRevision;
  }

  getEntry(id: DbId): Promise<RunningProcessEntry> {
    return this.pouchdbService.get<RunningProcessEntry>(id);
  }
}
