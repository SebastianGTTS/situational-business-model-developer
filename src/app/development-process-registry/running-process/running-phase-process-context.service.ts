import { Injectable } from '@angular/core';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import {
  ContextChangeErrors,
  RunningProcessContextServiceBase,
} from './running-process-context.service';
import {
  isRunningPhaseProcessEntry,
  RunningPhaseProcess,
  RunningPhaseProcessInit,
} from './running-phase-process';
import { DbId } from '../../database/database-entry';
import { PhaseListService } from '../phase/phase-list.service';
import { ArtifactDataService } from './artifact-data.service';
import { ArtifactService } from '../method-elements/artifact/artifact.service';
import { DevelopmentMethodService } from '../development-method/development-method.service';
import { MethodExecutionService } from './method-execution.service';
import { PouchdbService } from '../../database/pouchdb.service';
import { Router } from '@angular/router';
import {
  MethodDecision,
  MethodDecisionUpdate,
} from '../bm-process/method-decision';
import {
  BmPhaseProcessService,
  MissingArtifacts,
} from '../bm-process/bm-phase-process.service';
import { EntryType } from '../../database/database-model-part';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class RunningPhaseProcessContextService extends RunningProcessContextServiceBase<
  RunningPhaseProcess,
  RunningPhaseProcessInit
> {
  protected readonly elementConstructor = RunningPhaseProcess;

  constructor(
    artifactDataService: ArtifactDataService,
    artifactService: ArtifactService,
    private bmPhaseProcessService: BmPhaseProcessService,
    developmentMethodService: DevelopmentMethodService,
    methodExecutionService: MethodExecutionService,
    private phaseListService: PhaseListService,
    pouchdbService: PouchdbService,
    router: Router
  ) {
    super(
      artifactDataService,
      artifactService,
      developmentMethodService,
      methodExecutionService,
      pouchdbService,
      router
    );
  }

  async getList(): Promise<EntryType<RunningPhaseProcess>[]> {
    return (await super.getList()).filter((entry) =>
      isRunningPhaseProcessEntry(entry)
    );
  }

  async updatePhaseSelection(dbId: DbId, phaseIds: Set<string>): Promise<void> {
    try {
      const runningProcess = await this.getWrite(dbId);
      if (!runningProcess.isContextChange()) {
        throw new Error(ContextChangeErrors.WRONG_TYPE);
      }
      const phases = (await this.phaseListService.get()).phases.filter(
        (phase) => phaseIds.has(phase.id)
      );
      runningProcess.process.updatePhases(phases);
      await this.save(runningProcess);
    } finally {
      this.freeWrite(dbId);
    }
  }

  /**
   * Add a method to a bm phase process.
   *
   * @param dbId
   * @param phaseId
   * @param developmentMethodId
   */
  async addDecision(
    dbId: DbId,
    phaseId: string,
    developmentMethodId: DbId
  ): Promise<void> {
    try {
      const runningProcess = await this.getWrite(dbId);
      if (!runningProcess.isContextChange()) {
        throw new Error(ContextChangeErrors.WRONG_TYPE);
      }
      const method = await this.developmentMethodService.get(
        developmentMethodId
      );
      if (!this.developmentMethodService.isCorrectlyDefined(method)) {
        throw new Error(ContextChangeErrors.METHOD_ERROR);
      }
      runningProcess.process.addDecision(phaseId, method);
      await this.save(runningProcess);
    } finally {
      this.freeWrite(dbId);
    }
  }

  async insertDecision(
    id: DbId,
    phaseId: string,
    removedMethodId: string
  ): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      if (!runningProcess.isContextChange()) {
        throw new Error(ContextChangeErrors.WRONG_TYPE);
      }
      const removedMethod =
        runningProcess.contextChangeInfo.getRemovedMethod(removedMethodId);
      const phaseMethodDecision = runningProcess.process.addRemovedDecision(
        phaseId,
        removedMethod.decision
      );
      removedMethod.executions.forEach((executionId) => {
        const execution = runningProcess.getExecutedMethod(executionId);
        if (execution != null) {
          execution.nodeId = phaseMethodDecision.id;
          runningProcess
            .getArtifactsOfExecutedMethod(executionId)
            .forEach((artifact) =>
              artifact.versions.forEach(
                (version) => (version.createdBy = phaseMethodDecision.id)
              )
            );
        }
      });
      runningProcess.contextChangeInfo.removeRemovedMethod(removedMethodId);
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Update a decision from a bm process
   *
   * @param dbId
   * @param decisionId
   * @param methodDecisionUpdate
   */
  async updateDecision(
    dbId: DbId,
    decisionId: string,
    methodDecisionUpdate: MethodDecisionUpdate
  ): Promise<void> {
    try {
      const runningProcess = await this.getWrite(dbId);
      if (!runningProcess.isContextChange()) {
        throw new Error(ContextChangeErrors.WRONG_TYPE);
      }
      runningProcess.process.updateDecision(decisionId, methodDecisionUpdate);
      await this.save(runningProcess);
    } finally {
      this.freeWrite(dbId);
    }
  }

  /**
   * Update the enaction number of a decision from a bm process
   *
   * @param dbId
   * @param decisionId
   * @param number
   */
  async updateDecisionNumber(
    dbId: DbId,
    decisionId: string,
    number: number
  ): Promise<void> {
    try {
      const runningProcess = await this.getWrite(dbId);
      if (!runningProcess.isContextChange()) {
        throw new Error(ContextChangeErrors.WRONG_TYPE);
      }
      runningProcess.process.updateDecisionNumber(decisionId, number);
      await this.save(runningProcess);
    } finally {
      this.freeWrite(dbId);
    }
  }

  /**
   * Remove a development method from a process task or phase
   *
   * @param id
   * @param phaseMethodDecisionId
   */
  async removeDevelopmentMethod(
    id: DbId,
    phaseMethodDecisionId: string
  ): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      if (!runningProcess.isContextChange()) {
        throw new Error(ContextChangeErrors.WRONG_TYPE);
      }
      const decision = runningProcess.process.getPhaseMethodDecision(
        phaseMethodDecisionId
      );
      if (decision == null) {
        throw new Error('Decision does not exist');
      }
      runningProcess.process.removeDecision(phaseMethodDecisionId);
      await this.removeDecision(
        runningProcess,
        phaseMethodDecisionId,
        decision.decision
      );
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Remove an execution from a running process.
   *
   * @param id
   * @param executionId
   */
  async removeExecutedMethod(id: DbId, executionId: string): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      if (!runningProcess.isContextChange()) {
        throw new Error(ContextChangeErrors.WRONG_TYPE);
      }
      runningProcess.removeExecutedMethod(executionId);
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  protected async fakeExecuteMethod(
    runningProcess: RunningPhaseProcess,
    nodeId: string
  ): Promise<MethodDecision> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return runningProcess.process.getPhaseMethodDecision(nodeId)!.decision;
  }

  /**
   * Reset the execution to a specific position.
   *
   * @param id
   * @param phaseMethodDecisionId
   */
  async resetExecutionToPosition(
    id: DbId,
    phaseMethodDecisionId: string
  ): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      if (!runningProcess.isContextChange()) {
        throw new Error(ContextChangeErrors.WRONG_TYPE);
      }
      const phaseMethodDecision = runningProcess.process.getPhaseMethodDecision(
        phaseMethodDecisionId
      );
      if (phaseMethodDecision == null) {
        throw new Error('PhaseMethodDecision does not exist');
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      runningProcess.executionIndex = phaseMethodDecision.number!;
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  async skipExecution(id: DbId): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      if (!runningProcess.isContextChange()) {
        throw new Error(ContextChangeErrors.WRONG_TYPE);
      }
      runningProcess.executionIndex += 1;
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  async checkExecution(id: DbId): Promise<MissingArtifacts[]> {
    const runningProcess = await this.get(id);
    if (!runningProcess.isContextChange()) {
      throw new Error(ContextChangeErrors.WRONG_TYPE);
    }
    return this.bmPhaseProcessService.checkArtifacts(
      runningProcess.process,
      runningProcess.artifacts.map((artifact) => artifact.artifact),
      runningProcess.executionIndex
    );
  }

  protected async isComplete(
    runningProcess: RunningPhaseProcess
  ): Promise<boolean> {
    return this.bmPhaseProcessService.isComplete(runningProcess.process);
  }
}
