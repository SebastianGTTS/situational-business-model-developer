import { Injectable } from '@angular/core';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import { DbId } from '../../database/database-entry';
import { Domain } from '../knowledge/domain';
import { Selection, SelectionInit } from '../development-method/selection';
import {
  SituationalFactor,
  SituationalFactorInit,
} from '../method-elements/situational-factor/situational-factor';
import { RunningProcessServiceBase } from './running-process.service';
import {
  RunningLightProcess,
  RunningLightProcessInit,
} from './running-light-process';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class RunningLightProcessService extends RunningProcessServiceBase<
  RunningLightProcess,
  RunningLightProcessInit
> {
  protected readonly elementConstructor = RunningLightProcess;

  /**
   * Updates the domains for light processes.
   *
   * @param id
   * @param domains
   */
  async updateDomains(id: DbId, domains: Domain[]): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      runningProcess.domains = domains;
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Updates the factors for light processes.
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
      runningProcess.situationalFactors = situationalFactors.map(
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
   * A running light process always has executable methods left
   * as it is not clear when the process is finished. The business
   * developer needs to manually finish the process.
   */
  protected async hasExecutableMethodsLeft(): Promise<boolean> {
    return true;
  }
}
