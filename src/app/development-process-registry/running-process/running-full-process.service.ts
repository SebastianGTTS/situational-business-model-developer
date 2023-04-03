import { Injectable } from '@angular/core';
import { RunningProcessServiceBase } from './running-process.service';
import {
  RunningFullProcess,
  RunningFullProcessInit,
} from './running-full-process';
import { Domain } from '../knowledge/domain';
import { Selection } from '../development-method/selection';
import { SituationalFactor } from '../method-elements/situational-factor/situational-factor';
import { ContextChangeInfo } from './context-change-info';
import { DbId } from '../../database/database-entry';

@Injectable()
export abstract class RunningFullProcessServiceBase<
  T extends RunningFullProcess,
  S extends RunningFullProcessInit
> extends RunningProcessServiceBase<T, S> {
  /**
   * Set context change of running process to true
   *
   * @param runningProcessId the id of the running process
   * @param comment comment from the method engineer why and what changes are necessary
   * @param domains suggested domains
   * @param situationalFactors suggested situationalFactors
   */
  async setContextChange(
    runningProcessId: DbId,
    comment: string,
    domains: Domain[],
    situationalFactors: Selection<SituationalFactor>[]
  ): Promise<void> {
    try {
      const runningProcess = await this.getWrite(runningProcessId);
      runningProcess.contextChange = true;
      runningProcess.contextChangeInfo = new ContextChangeInfo(undefined, {
        comment: comment,
        suggestedDomains: domains,
        suggestedSituationalFactors: situationalFactors,
        oldDomains: runningProcess.process.domains,
        oldSituationalFactors: runningProcess.process.situationalFactors,
      });
      await this.save(runningProcess);
    } finally {
      this.freeWrite(runningProcessId);
    }
  }
}
