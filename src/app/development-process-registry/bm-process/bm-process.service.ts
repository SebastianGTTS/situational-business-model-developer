import { Injectable } from '@angular/core';
import { IconInit } from 'src/app/model/icon';
import { DbId } from '../../database/database-entry';
import { EntryType } from '../../database/database-model-part';
import { DefaultElementService } from '../../database/default-element.service';
import { PouchdbService } from '../../database/pouchdb.service';
import { isMethodExecutionStep } from '../development-method/execution-step';
import { Selection, SelectionInit } from '../development-method/selection';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import { Domain } from '../knowledge/domain';
import {
  SituationalFactor,
  SituationalFactorInit,
} from '../method-elements/situational-factor/situational-factor';
import {
  SituationalFactorService,
  SituationalFactorsMatchResult,
} from '../method-elements/situational-factor/situational-factor.service';
import { ModuleService } from '../module-api/module.service';
import { BmProcess, BmProcessEntry, BmProcessInit } from './bm-process';
import { MethodDecision } from './method-decision';

@Injectable()
export abstract class BmProcessServiceBase<
  T extends BmProcess,
  S extends BmProcessInit
> extends DefaultElementService<T, S> {
  protected readonly typeName = BmProcess.typeName;

  constructor(
    protected moduleService: ModuleService,
    pouchdbService: PouchdbService,
    protected situationalFactorService: SituationalFactorService
  ) {
    super(pouchdbService);
  }

  /**
   * Update the info of a bm process
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
   * Update the icon of a bm process
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
}

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class BmProcessService extends BmProcessServiceBase<
  BmProcess,
  BmProcessInit
> {
  protected readonly elementConstructor = BmProcess;

  getEntry(id: DbId): Promise<BmProcessEntry> {
    return this.pouchdbService.get<EntryType<BmProcess>>(id);
  }
}
