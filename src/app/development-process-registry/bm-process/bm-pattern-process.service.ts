import { Injectable } from '@angular/core';
import { PouchdbService } from '../../database/pouchdb.service';
import {
  BmPatternProcess,
  BmPatternProcessEntry,
  BmPatternProcessInit,
  isBmPatternProcessEntry,
} from './bm-pattern-process';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import { ModuleService } from '../module-api/module.service';
import { DbId } from '../../database/database-entry';
import { MethodDecision } from './method-decision';
import { SituationalFactorService } from '../method-elements/situational-factor/situational-factor.service';
import { ProcessPatternService } from '../process-pattern/process-pattern.service';
import { BmPatternProcessDiagramService } from './bm-pattern-process-diagram.service';
import { DevelopmentMethodService } from '../development-method/development-method.service';
import { ProcessPattern } from '../process-pattern/process-pattern';
import { MissingArtifactsNodesList } from './bm-process-diagram-artifacts';
import { BmProcessService, BmProcessServiceBase } from './bm-process.service';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class BmPatternProcessService extends BmProcessServiceBase<
  BmPatternProcess,
  BmPatternProcessInit
> {
  protected readonly elementConstructor = BmPatternProcess;

  constructor(
    private bmProcessDiagramService: BmPatternProcessDiagramService,
    private bmProcessService: BmProcessService,
    private developmentMethodService: DevelopmentMethodService,
    moduleService: ModuleService,
    pouchdbService: PouchdbService,
    private processPatternService: ProcessPatternService,
    situationalFactorService: SituationalFactorService
  ) {
    super(moduleService, pouchdbService, situationalFactorService);
  }

  async getList(): Promise<BmPatternProcessEntry[]> {
    return (await super.getList()).filter((entry) =>
      isBmPatternProcessEntry(entry)
    );
  }

  async getBmProcessInitialization(
    name: string
  ): Promise<BmPatternProcessInit> {
    return {
      name: name,
      processDiagram:
        await this.bmProcessDiagramService.getEmptyBmProcessDiagram(),
    };
  }

  /**
   * Convert a bm process to a bm pattern process
   *
   * @param dbId
   */
  async convertBmProcess(dbId: DbId): Promise<void> {
    try {
      const bmProcess = await this.bmProcessService.getWrite(dbId);
      const patternProcess = new BmPatternProcess(undefined, {
        ...bmProcess,
        processDiagram:
          await this.bmProcessDiagramService.getEmptyBmProcessDiagram(),
      });
      await this.save(patternProcess);
    } finally {
      this.bmProcessService.freeWrite(dbId);
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
   * Checks whether a bm process is completely defined
   *
   * @param bmProcess
   */
  async isComplete(bmProcess: BmPatternProcess): Promise<boolean> {
    return (
      bmProcess.isComplete() &&
      Object.values(bmProcess.decisions).every((decision) =>
        this.checkDecisionStepArtifacts(decision)
      ) &&
      !(await this.hasEmptyTasks(bmProcess))
    );
  }

  /**
   * Checks whether the bm process has tasks which do not have a
   * method connected
   *
   * @param bmProcess
   */
  async hasEmptyTasks(bmProcess: BmPatternProcess): Promise<boolean> {
    return this.bmProcessDiagramService.hasEmptyTasks(bmProcess);
  }

  /**
   * Gets all tasks that have no method connected
   *
   * @param bmProcess
   */
  async getEmptyTasks(
    bmProcess: BmPatternProcess
  ): Promise<{ elementId: string; name: string }[]> {
    return this.bmProcessDiagramService.getEmptyTasks(bmProcess);
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
    bmProcess: BmPatternProcess
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
    bmProcess: BmPatternProcess
  ): Promise<MissingArtifactsNodesList> {
    return this.bmProcessDiagramService.checkArtifacts(bmProcess);
  }
}
