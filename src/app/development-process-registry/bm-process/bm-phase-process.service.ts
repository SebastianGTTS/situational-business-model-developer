import { Injectable } from '@angular/core';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import { ModuleService } from '../module-api/module.service';
import { PouchdbService } from '../../database/pouchdb.service';
import { SituationalFactorService } from '../method-elements/situational-factor/situational-factor.service';
import { BmProcessService, BmProcessServiceBase } from './bm-process.service';
import {
  BmPhaseProcess,
  BmPhaseProcessEntry,
  BmPhaseProcessInit,
  isBmPhaseProcessEntry,
} from './bm-phase-process';
import { DbId } from '../../database/database-entry';
import { PhaseListService } from '../phase/phase-list.service';
import { DevelopmentMethodService } from '../development-method/development-method.service';
import { MethodDecisionUpdate } from './method-decision';
import { PhaseMethodDecision } from './phase-method-decision';
import { Artifact } from '../method-elements/artifact/artifact';

export interface MissingArtifacts {
  phaseMethodDecision: PhaseMethodDecision;
  missingArtifacts: Artifact[];
}

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class BmPhaseProcessService extends BmProcessServiceBase<
  BmPhaseProcess,
  BmPhaseProcessInit
> {
  protected readonly elementConstructor = BmPhaseProcess;

  constructor(
    private bmProcessService: BmProcessService,
    private developmentMethodService: DevelopmentMethodService,
    moduleService: ModuleService,
    private phaseListService: PhaseListService,
    pouchdbService: PouchdbService,
    situationalFactorService: SituationalFactorService
  ) {
    super(moduleService, pouchdbService, situationalFactorService);
  }

  async getList(): Promise<BmPhaseProcessEntry[]> {
    return (await super.getList()).filter((entry) =>
      isBmPhaseProcessEntry(entry)
    );
  }

  /**
   * Convert a bm process to a phase process
   *
   * @param dbId
   */
  async convertBmProcess(dbId: DbId): Promise<void> {
    try {
      const bmProcess = await this.bmProcessService.getWrite(dbId);
      const phaseProcess = new BmPhaseProcess(undefined, {
        ...bmProcess,
      });
      await this.save(phaseProcess);
    } finally {
      this.bmProcessService.freeWrite(dbId);
    }
  }

  /**
   * Checks whether a bm process is completely defined
   *
   * @param bmProcess
   */
  async isComplete(bmProcess: BmPhaseProcess): Promise<boolean> {
    return (
      bmProcess.isComplete() &&
      bmProcess
        .getAllPhaseMethodDecisions()
        .every((decision) => this.checkDecisionStepArtifacts(decision.decision))
    );
  }

  async updatePhaseSelection(dbId: DbId, phaseIds: Set<string>): Promise<void> {
    try {
      const bmProcess = await this.getWrite(dbId);
      const phases = (await this.phaseListService.get()).phases.filter(
        (phase) => phaseIds.has(phase.id)
      );
      bmProcess.updatePhases(phases);
      await this.save(bmProcess);
    } finally {
      this.freeWrite(dbId);
    }
  }

  /**
   * Add a method to a bm process.
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
      const bmProcess = await this.getWrite(dbId);
      const method = await this.developmentMethodService.get(
        developmentMethodId
      );
      if (!this.developmentMethodService.isCorrectlyDefined(method)) {
        throw new Error('Method not correctly defined');
      }
      bmProcess.addDecision(phaseId, method);
      await this.save(bmProcess);
    } finally {
      this.freeWrite(dbId);
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
      const bmProcess = await this.getWrite(dbId);
      bmProcess.updateDecision(decisionId, methodDecisionUpdate);
      await this.save(bmProcess);
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
      const bmProcess = await this.getWrite(dbId);
      bmProcess.updateDecisionNumber(decisionId, number);
      await this.save(bmProcess);
    } finally {
      this.freeWrite(dbId);
    }
  }

  /**
   * Remove a decision from a bm process
   *
   * @param dbId
   * @param decisionId
   */
  async removeDecision(dbId: DbId, decisionId: string): Promise<void> {
    try {
      const bmProcess = await this.getWrite(dbId);
      bmProcess.removeDecision(decisionId);
      await this.save(bmProcess);
    } finally {
      this.freeWrite(dbId);
    }
  }

  /**
   * Check for missing artifacts
   *
   * @param bmProcess
   * @param currentArtifacts artifacts that are already available
   * @param executionIndex
   */
  checkArtifacts(
    bmProcess: BmPhaseProcess,
    currentArtifacts?: Artifact[],
    executionIndex?: number
  ): MissingArtifacts[] {
    const missingArtifacts: MissingArtifacts[] = [];
    let executionOrder = bmProcess.getSortedPhaseMethodDecisions();
    const artifacts: Set<string> = new Set<string>();
    if (currentArtifacts != null) {
      currentArtifacts.forEach((artifact) => artifacts.add(artifact._id));
    }
    if (executionIndex != null) {
      executionOrder = executionOrder.slice(executionIndex - 1);
    }
    for (const phaseMethodDecision of executionOrder) {
      const decision = phaseMethodDecision.decision;
      const needs: Artifact[] = decision.inputArtifacts
        .getSelectedElementsOptional()
        .filter((element) => !element.optional)
        .map((element) => element.element);
      const provides: Artifact[] =
        decision.outputArtifacts.getSelectedElements();
      const missing = needs.filter((artifact) => !artifacts.has(artifact._id));
      if (missing.length > 0) {
        missingArtifacts.push({
          phaseMethodDecision: phaseMethodDecision,
          missingArtifacts: missing,
        });
      }
      provides.forEach((artifact) => artifacts.add(artifact._id));
    }
    return missingArtifacts;
  }
}
