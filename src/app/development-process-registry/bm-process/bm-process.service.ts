import { Injectable } from '@angular/core';
import { PouchdbService } from '../../database/pouchdb.service';
import { BmProcess, BmProcessInit } from './bm-process';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import {
  SituationalFactor,
  SituationalFactorEntry,
  SituationalFactorInit,
} from '../method-elements/situational-factor/situational-factor';
import { ModuleService } from '../module-api/module.service';
import { Decision } from './decision';
import { DefaultElementService } from '../../database/default-element.service';
import { DbId } from '../../database/database-entry';
import { Domain } from '../knowledge/domain';
import { Selection, SelectionInit } from '../development-method/selection';

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
    private moduleService: ModuleService,
    pouchdbService: PouchdbService
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
    const dbProcess = await this.get(id);
    dbProcess.finishInitialization();
    await this.save(dbProcess);
  }

  /**
   * Update the domains of the bm process
   *
   * @param id the id of the bm process to update
   * @param domains the domains to set for the bm process
   */
  async updateDomains(id: DbId, domains: Domain[]): Promise<void> {
    const dbProcess = await this.get(id);
    dbProcess.domains = domains;
    await this.save(dbProcess);
  }

  async updateSituationalFactors(
    id: DbId,
    situationalFactors: SelectionInit<SituationalFactorInit>[]
  ): Promise<void> {
    const dbProcess = await this.get(id);
    dbProcess.situationalFactors = situationalFactors.map(
      (selection) =>
        new Selection<SituationalFactor>(
          undefined,
          selection,
          SituationalFactor
        )
    );
    await this.save(dbProcess);
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
    decisions?: { [elementId: string]: Decision }
  ): Promise<void> {
    const dbProcess = await this.get(id);
    dbProcess.processDiagram = processDiagram;
    if (decisions != null) {
      dbProcess.updateDecisions(decisions);
    }
    await this.save(dbProcess);
  }

  /**
   * Calculate the distance of a process context to provided situational factors
   *
   * @param process the bm process
   * @param provided the provided situational factors
   * @return the distance
   */
  distanceToContext(
    process: BmProcess,
    provided: (SituationalFactor | SituationalFactorEntry)[]
  ): number {
    const map = SituationalFactor.createMap(provided);
    const { missing, incorrect, low } = process.checkMatchByFactor(map);
    let distance = incorrect.length;
    low.forEach((factor) => {
      const internalDistance =
        factor.factor.values.indexOf(factor.value) -
        factor.factor.values.indexOf(
          map[factor.factor.list][factor.factor.name]
        );
      distance += internalDistance / factor.factor.values.length;
    });
    const correct =
      process.situationalFactors.length -
      missing.length -
      incorrect.length -
      low.length;
    return distance - correct;
  }

  /**
   * Check whether the step decisions of a step of a decision are all correctly filled in.
   *
   * @param decision the decision
   * @return whether the step decisions are all correctly filled in
   */
  checkDecisionStepArtifacts(decision: Decision): boolean {
    for (let i = 0; i < decision.method.executionSteps.length; i++) {
      const step = decision.method.executionSteps[i];
      const method = this.moduleService.getModuleMethod(
        step.module,
        step.method
      );
      if (method.createDecisionConfigurationForm != null) {
        const form = method.createDecisionConfigurationForm(
          decision.stepDecisions[i]
        );
        if (!form.valid) {
          return false;
        }
      }
    }
    return true;
  }
}
