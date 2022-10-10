import { Injectable } from '@angular/core';
import { PouchdbService } from '../../database/pouchdb.service';
import { BmProcess, BmProcessInit } from './bm-process';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import {
  SituationalFactor,
  SituationalFactorInit,
} from '../method-elements/situational-factor/situational-factor';
import { ModuleService } from '../module-api/module.service';
import { DefaultElementService } from '../../database/default-element.service';
import { DbId } from '../../database/database-entry';
import { Domain } from '../knowledge/domain';
import { Selection, SelectionInit } from '../development-method/selection';
import { MethodDecision } from './method-decision';
import { isMethodExecutionStep } from '../development-method/execution-step';
import {
  SituationalFactorService,
  SituationalFactorsMatchResult,
} from '../method-elements/situational-factor/situational-factor.service';
import { ProcessPatternService } from '../process-pattern/process-pattern.service';
import { BmProcessDiagramService } from './bm-process-diagram.service';
import { DevelopmentMethodService } from '../development-method/development-method.service';
import { ProcessPattern } from '../process-pattern/process-pattern';
import { MissingArtifactsNodesList } from './bm-process-diagram-artifacts';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class BmProcessService extends DefaultElementService<
  BmProcess,
  BmProcessInit
> {
  protected readonly typeName = BmProcess.typeName;

  protected readonly elementConstructor = BmProcess;

  constructor(
    private bmProcessDiagramService: BmProcessDiagramService,
    private developmentMethodService: DevelopmentMethodService,
    private moduleService: ModuleService,
    pouchdbService: PouchdbService,
    private processPatternService: ProcessPatternService,
    private situationalFactorService: SituationalFactorService
  ) {
    super(pouchdbService);
  }

  /**
   * Finish the initialization process of a bm process, i.e.,
   * the context selection is finished.
   *
   * @param id the id of the bm process
   */
  async finishInitialization(id: DbId): Promise<void> {
    try {
      const dbProcess = await this.getWrite(id);
      dbProcess.finishInitialization();
      await this.save(dbProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Update the domains of the bm process
   *
   * @param id the id of the bm process to update
   * @param domains the domains to set for the bm process
   */
  async updateDomains(id: DbId, domains: Domain[]): Promise<void> {
    try {
      const dbProcess = await this.getWrite(id);
      dbProcess.domains = domains;
      await this.save(dbProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  async updateSituationalFactors(
    id: DbId,
    situationalFactors: SelectionInit<SituationalFactorInit>[]
  ): Promise<void> {
    try {
      const dbProcess = await this.getWrite(id);
      dbProcess.situationalFactors = situationalFactors.map(
        (selection) =>
          new Selection<SituationalFactor>(
            undefined,
            selection,
            SituationalFactor
          )
      );
      await this.save(dbProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Save the bm process diagram, maybe together with new decisions.
   *
   * @param id the id of the bm process
   * @param processDiagram the process diagram
   * @param decisions the decisions
   */
  async saveBmProcessDiagram(
    id: DbId,
    processDiagram: string,
    decisions?: { [elementId: string]: MethodDecision }
  ): Promise<void> {
    try {
      const dbProcess = await this.getWrite(id);
      dbProcess.processDiagram = processDiagram;
      if (decisions != null) {
        dbProcess.updateDecisions(decisions);
      }
      await this.save(dbProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Check whether certain situational factors match with the factors of the bm process
   *
   * @param bmProcess
   * @param factors
   */
  checkMatch(
    bmProcess: BmProcess,
    factors: SituationalFactor[]
  ): SituationalFactorsMatchResult {
    const map = this.situationalFactorService.createMap(factors);
    return this.situationalFactorService.checkMatch(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      bmProcess.situationalFactors.map((factor) => factor.element!),
      map
    );
  }

  /**
   * Checks whether a bm process is completely defined
   *
   * @param bmProcess
   */
  isComplete(bmProcess: BmProcess): boolean {
    return (
      bmProcess.isComplete() &&
      Object.values(bmProcess.decisions).every((decision) =>
        this.checkDecisionStepArtifacts(decision)
      )
    );
  }

  /**
   * Check whether the step decisions of a step of a decision are all correctly filled in.
   *
   * @param decision
   * @return whether the step decisions are all correctly filled in
   */
  checkDecisionStepArtifacts(decision: MethodDecision): boolean {
    for (let i = 0; i < decision.method.executionSteps.length; i++) {
      const step = decision.method.executionSteps[i];
      if (isMethodExecutionStep(step)) {
        const method = this.moduleService.getModuleMethod(
          step.module,
          step.method
        );
        if (method == null) {
          throw new Error('ExecutionStep uses unknown method');
        }
        if (method.createDecisionConfigurationForm != null) {
          const form = method.createDecisionConfigurationForm(
            decision.stepDecisions[i]
          );
          if (!form.valid) {
            return false;
          }
        }
      }
    }
    return true;
  }

  /**
   * Append a process pattern to a bm process
   *
   * @param id id of the bm process
   * @param patternId id of the pattern to append to the bm process
   * @param nodeId id of the node in the bm process to append the process pattern to
   */
  async appendProcessPattern(
    id: DbId,
    patternId: DbId,
    nodeId: string
  ): Promise<void> {
    try {
      const bmProcess = await this.getWrite(id);
      const pattern = await this.processPatternService.get(patternId);
      if (!(await this.processPatternService.isCorrectlyDefined(pattern))) {
        throw new Error('Process Pattern is not correctly defined');
      }
      await this.bmProcessDiagramService.appendProcessPattern(
        bmProcess,
        pattern,
        nodeId
      );
      await this.save(bmProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Insert a process pattern into a process task
   *
   * @param id
   * @param patternId
   * @param nodeId
   */
  async insertProcessPattern(
    id: DbId,
    patternId: DbId,
    nodeId: string
  ): Promise<void> {
    try {
      const bmProcess = await this.getWrite(id);
      const pattern = await this.processPatternService.get(patternId);
      if (!(await this.processPatternService.isCorrectlyDefined(pattern))) {
        throw new Error('Process Pattern is not correctly defined');
      }
      bmProcess.removeDecision(nodeId);
      await this.bmProcessDiagramService.insertProcessPattern(
        bmProcess,
        pattern,
        nodeId
      );
      await this.save(bmProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Remove a process pattern from a bm process
   *
   * @param id
   * @param nodeId id of the node in the bm process to remove
   */
  async removeProcessPattern(id: DbId, nodeId: string): Promise<void> {
    try {
      const bmProcess = await this.getWrite(id);
      await this.bmProcessDiagramService.removeProcessPattern(
        bmProcess,
        nodeId
      );
      await this.save(bmProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Insert a development method into a process task
   *
   * @param id
   * @param nodeId
   * @param developmentMethodId
   */
  async insertDevelopmentMethod(
    id: DbId,
    nodeId: string,
    developmentMethodId: DbId
  ): Promise<void> {
    try {
      const bmProcess = await this.getWrite(id);
      const method = await this.developmentMethodService.get(
        developmentMethodId
      );
      if (!this.developmentMethodService.isCorrectlyDefined(method)) {
        throw new Error('Method not correctly defined');
      }
      bmProcess.addDecision(nodeId, method);
      await this.bmProcessDiagramService.insertDevelopmentMethod(
        bmProcess,
        nodeId,
        method
      );
      await this.save(bmProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Remove a development method from a process task
   *
   * @param id
   * @param nodeId
   */
  async removeDevelopmentMethod(id: DbId, nodeId: string): Promise<void> {
    try {
      const bmProcess = await this.getWrite(id);
      bmProcess.removeDecision(nodeId);
      await this.bmProcessDiagramService.removeDevelopmentMethod(
        bmProcess,
        nodeId
      );
      await this.save(bmProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Get all patterns used by a bm process
   *
   * @param bmProcess
   */
  async getPatterns(
    bmProcess: BmProcess
  ): Promise<{ nodeId: string; processPattern: ProcessPattern }[]> {
    const patternElements =
      await this.bmProcessDiagramService.getPatternProcesses(bmProcess);
    const dbPatterns = await this.processPatternService.getProcessPatterns(
      patternElements.map((patternElement) => patternElement.processPatternId)
    );
    const dbPatternsMap: { [id: string]: ProcessPattern } = {};
    dbPatterns.forEach(
      (dbPattern) => (dbPatternsMap[dbPattern._id] = dbPattern)
    );
    return patternElements.map((patternElement) => {
      return {
        nodeId: patternElement.nodeId,
        processPattern: dbPatternsMap[patternElement.processPatternId],
      };
    });
  }

  /**
   * Check for missing artifacts and unreachable nodes
   *
   * @param bmProcess
   */
  async checkArtifacts(
    bmProcess: BmProcess
  ): Promise<MissingArtifactsNodesList> {
    return this.bmProcessDiagramService.checkArtifacts(bmProcess);
  }
}
