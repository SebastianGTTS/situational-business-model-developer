import { Injectable } from '@angular/core';
import { PouchdbService } from '../../database/pouchdb.service';
import { BmProcess } from './bm-process';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import { SituationalFactor } from '../method-elements/situational-factor/situational-factor';
import { ModuleService } from '../module-api/module.service';
import { Decision } from './decision';
import { DefaultElementService } from '../../database/default-element.service';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class BmProcessService extends DefaultElementService<BmProcess> {
  protected get typeName(): string {
    return BmProcess.typeName;
  }

  constructor(
    private moduleService: ModuleService,
    pouchdbService: PouchdbService
  ) {
    super(pouchdbService);
  }

  /**
   * Update the bm process.
   *
   * @param id id of the bm process
   * @param bmProcess the new values of the object (values will be copied)
   */
  async update(id: string, bmProcess: Partial<BmProcess>) {
    const dbProcess = await this.get(id);
    dbProcess.update(bmProcess);
    return this.save(dbProcess);
  }

  /**
   * Calculate the distance of a process context to provided situational factors
   *
   * @param process the bm process
   * @param provided the provided situational factors
   * @return the distance
   */
  distanceToContext(process: BmProcess, provided: SituationalFactor[]): number {
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

  protected createElement(element: Partial<BmProcess>): BmProcess {
    return new BmProcess(element);
  }
}
