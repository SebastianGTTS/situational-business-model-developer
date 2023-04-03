import { Injectable } from '@angular/core';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import {
  RunningPhaseProcess,
  RunningPhaseProcessInit,
} from './running-phase-process';
import { RunningFullProcessServiceBase } from './running-full-process.service';
import { PhaseMethodDecision } from '../bm-process/phase-method-decision';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class RunningPhaseProcessService extends RunningFullProcessServiceBase<
  RunningPhaseProcess,
  RunningPhaseProcessInit
> {
  protected readonly elementConstructor = RunningPhaseProcess;

  protected async moveToNextMethod(
    runningProcess: RunningPhaseProcess
  ): Promise<void> {
    runningProcess.executionIndex += 1;
  }

  protected async hasExecutableMethodsLeft(
    runningProcess: RunningPhaseProcess
  ): Promise<boolean> {
    if (await super.hasExecutableMethodsLeft(runningProcess)) {
      return true;
    }
    return this.getExecutableMethod(runningProcess) != null;
  }

  /**
   * Start the execution of a method
   *
   * @param id the id of the running process
   * @param phaseMethodDecisionId the id of the phase method decision to execute
   */
  async startMethodExecution(
    id: string,
    phaseMethodDecisionId: string
  ): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      this.methodExecutionService.startMethodExecution(
        runningProcess,
        phaseMethodDecisionId
      );
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Get the phase method decision that is ready to be executed
   *
   * @param runningProcess
   */
  getExecutableMethod(
    runningProcess: RunningPhaseProcess
  ): PhaseMethodDecision | undefined {
    const phaseMethodDecision =
      runningProcess.process.getPhaseMethodDecisionByExecutionNumber(
        runningProcess.executionIndex
      );
    if (
      runningProcess.getRunningMethodByNode(phaseMethodDecision?.id) != null
    ) {
      return undefined;
    }
    return phaseMethodDecision;
  }
}
