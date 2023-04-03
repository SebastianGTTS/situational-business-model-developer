import { Injectable } from '@angular/core';
import { PouchdbService } from '../../database/pouchdb.service';
import { EntryType } from '../../database/database-model-part';
import { ArtifactDataService } from './artifact-data.service';
import { MethodExecutionService } from './method-execution.service';
import { DbId } from '../../database/database-entry';
import { Domain } from '../knowledge/domain';
import { Selection, SelectionInit } from '../development-method/selection';
import {
  SituationalFactor,
  SituationalFactorInit,
} from '../method-elements/situational-factor/situational-factor';
import { MethodDecision } from '../bm-process/method-decision';
import { Router } from '@angular/router';
import { ArtifactService } from '../method-elements/artifact/artifact.service';
import { DevelopmentMethodService } from '../development-method/development-method.service';
import { RemovedMethod } from './removed-method';
import { v4 as uuidv4 } from 'uuid';
import { RunningFullProcessServiceBase } from './running-full-process.service';
import {
  ContextChangeRunningProcess,
  RunningFullProcess,
  RunningFullProcessInit,
} from './running-full-process';

export enum ContextChangeErrors {
  WRONG_TYPE = 'Process must be in context change mode',
  METHOD_ERROR = 'Method not correctly defined',
  PROCESS_INCOMPLETE = 'Process is incomplete',
  ARTIFACT_ALREADY_MAPPED = 'Artifact already has a mapping to an execution',
  NOT_EXECUTABLE = 'The selected node is not executable',
}

@Injectable()
export abstract class RunningProcessContextServiceBase<
  T extends RunningFullProcess,
  S extends RunningFullProcessInit
> extends RunningFullProcessServiceBase<T, S> {
  protected constructor(
    artifactDataService: ArtifactDataService,
    artifactService: ArtifactService,
    protected developmentMethodService: DevelopmentMethodService,
    methodExecutionService: MethodExecutionService,
    pouchdbService: PouchdbService,
    router: Router
  ) {
    super(
      artifactDataService,
      artifactService,
      methodExecutionService,
      pouchdbService,
      router
    );
  }

  async getList(): Promise<EntryType<T>[]> {
    return this.pouchdbService.find<EntryType<T>>(this.typeName, {
      selector: {
        contextChange: true,
      },
    });
  }

  /**
   * Update the domains of the running process.
   * Updates the internal bm process.
   *
   * @param id
   * @param domains
   */
  async updateDomains(id: DbId, domains: Domain[]): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      if (!runningProcess.isContextChange()) {
        throw new Error(ContextChangeErrors.WRONG_TYPE);
      }
      runningProcess.process.domains = domains;
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Update the situational factors of the running process.
   * Updates the internal bm process.
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
      if (!runningProcess.isContextChange()) {
        throw new Error(ContextChangeErrors.WRONG_TYPE);
      }
      runningProcess.process.situationalFactors = situationalFactors.map(
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

  /**
   * Remove the mappings towards a node.
   * This aborts all executions of the node,
   * removes all mappings from executions to the node,
   * adds the decision to the removed methods, and
   * removes all mappings from artifacts to the node.
   *
   * @param runningProcess
   * @param nodeId
   * @param decision
   */
  protected async removeDecision(
    runningProcess: ContextChangeRunningProcess,
    nodeId: string,
    decision: MethodDecision
  ): Promise<void> {
    /* there should be only one method with this nodeId currently running, but to be more
     robust we use a for loop */
    for (
      let runningMethod = runningProcess.getRunningMethodByNode(nodeId);
      runningMethod != null;
      runningMethod = runningProcess.getRunningMethodByNode(nodeId)
    ) {
      await this.methodExecutionService.abortMethodExecution(
        runningProcess,
        runningMethod.executionId
      );
    }
    const executions = runningProcess.getExecutionsByNodeId(nodeId);
    runningProcess.contextChangeInfo.addRemovedMethod(
      new RemovedMethod(undefined, {
        executions: executions.map((execution) => execution.executionId),
        decision: decision,
      })
    );
    executions.forEach((execution) => (execution.nodeId = undefined));
    const artifacts = runningProcess.getArtifactsCreatedByNode(nodeId);
    artifacts.forEach((artifact) =>
      artifact.versions.forEach((version) => (version.createdBy = 'manual'))
    );
  }

  /**
   * Remove an already removed method forever.
   *
   * @param id
   * @param removedMethodId
   */
  async removeRemovedMethod(id: DbId, removedMethodId: string): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      if (!runningProcess.isContextChange()) {
        throw new Error(ContextChangeErrors.WRONG_TYPE);
      }
      runningProcess.contextChangeInfo.removeRemovedMethod(removedMethodId);
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Fake a method execution
   *
   * @param id
   * @param nodeId
   * @param outputMapping
   */
  async fakeMethodExecution(
    id: DbId,
    nodeId: string,
    outputMapping: { artifact: number; version: number }[]
  ): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      if (!runningProcess.isContextChange()) {
        throw new Error(ContextChangeErrors.WRONG_TYPE);
      }
      const decision = await this.fakeExecuteMethod(runningProcess, nodeId);
      const executionId = uuidv4();
      runningProcess.addExecutedMethod({
        methodName: decision.method.name,
        executionId: executionId,
        nodeId: nodeId,
        comments: [],
      });
      outputMapping.forEach((mapping) => {
        const artifactVersion =
          runningProcess.artifacts[mapping.artifact].versions[mapping.version];
        if (artifactVersion.executedBy != null) {
          throw new Error(ContextChangeErrors.ARTIFACT_ALREADY_MAPPED);
        }
        artifactVersion.executedBy = executionId;
        artifactVersion.createdBy = nodeId;
      });
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Fake execute a method and mark it as executed. Return the corresponding MethodDecision.
   *
   * @param runningProcess
   * @param nodeId the id of the node or the phaseMethodDecisionId
   */
  protected abstract fakeExecuteMethod(
    runningProcess: T & ContextChangeRunningProcess,
    nodeId: string
  ): Promise<MethodDecision>;

  async updateStep(runningProcessId: DbId, step: string): Promise<void> {
    try {
      const runningProcess = await this.getWrite(runningProcessId);
      if (!runningProcess.isContextChange()) {
        return; // ignore wrong type as called on destroy if context change already finished
      }
      runningProcess.contextChangeInfo.step = step;
      await this.save(runningProcess);
    } finally {
      this.freeWrite(runningProcessId);
    }
  }

  async finishContextChange(runningProcessId: DbId): Promise<void> {
    try {
      const runningProcess: T = await this.getWrite(runningProcessId);
      if (!runningProcess.isContextChange()) {
        throw new Error(ContextChangeErrors.WRONG_TYPE);
      }
      if (!(await this.isComplete(runningProcess))) {
        throw new Error(ContextChangeErrors.PROCESS_INCOMPLETE);
      }
      runningProcess.previousContextChanges.push(
        runningProcess.contextChangeInfo
      );
      (runningProcess as T).contextChange = false;
      (runningProcess as T).contextChangeInfo = undefined;
      await this.save(runningProcess);
    } finally {
      this.freeWrite(runningProcessId);
    }
  }

  protected abstract isComplete(runningProcess: T): Promise<boolean>;

  abstract removeExecutedMethod(id: DbId, executionId: string): Promise<void>;

  protected async navigateToRunningProcess(runningProcess: T): Promise<void> {
    await this.router.navigate([
      'bmprocess',
      'contextchange',
      runningProcess._id,
    ]);
  }
}
