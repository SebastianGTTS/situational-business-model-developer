import {
  RunningFullProcess,
  RunningFullProcessEntry,
  RunningFullProcessInit,
} from './running-full-process';
import {
  BmPhaseProcess,
  BmPhaseProcessEntry,
  BmPhaseProcessInit,
  isBmPhaseProcess,
  isBmPhaseProcessEntry,
  isBmPhaseProcessInit,
} from '../bm-process/bm-phase-process';
import { RunningMethod } from './running-method';
import { Step } from './step';
import {
  RunningProcess,
  RunningProcessEntry,
  RunningProcessInit,
} from './running-process';

export interface RunningPhaseProcessInit extends RunningFullProcessInit {
  process: BmPhaseProcessInit;
  executionIndex?: number;
}

export interface RunningPhaseProcessEntry extends RunningFullProcessEntry {
  process: BmPhaseProcessEntry;
  executionIndex?: number;
}

export class RunningPhaseProcess extends RunningFullProcess {
  process: BmPhaseProcess;
  executionIndex = 1;

  constructor(
    entry: RunningPhaseProcessEntry | undefined,
    init: RunningPhaseProcessInit | undefined
  ) {
    super(entry, init);
    if (entry != null) {
      this.process = new BmPhaseProcess(entry.process, undefined);
      this.executionIndex = entry.executionIndex ?? this.executionIndex;
    } else if (init != null) {
      this.process = new BmPhaseProcess(undefined, init.process);
      this.executionIndex = init.executionIndex ?? this.executionIndex;
    } else {
      throw new Error('Either entry or init must be provided.');
    }
  }

  /**
   * Add a running method of the bm process to the currently executed methods list
   *
   * @param phaseMethodDecisionId the id of the phase method decision
   * @return the added running method
   */
  addRunningMethodOfProcess(phaseMethodDecisionId: string): RunningMethod {
    const phaseMethodDecision = this.process.getPhaseMethodDecision(
      phaseMethodDecisionId
    );
    if (phaseMethodDecision == null) {
      throw new Error('Phase method decision does not exist');
    }
    const method = new RunningMethod(undefined, {
      nodeId: phaseMethodDecisionId,
      decision: phaseMethodDecision.decision,
      steps: phaseMethodDecision.decision.method.executionSteps.map(
        () => new Step(undefined, {})
      ),
    });
    this.addRunningMethod(method);
    return method;
  }

  /**
   * Checks whether a method to execute is defined for the node
   *
   * @param phaseMethodDecisionId the id of the phase method decision
   * @return true if a method is defined
   */
  isExecutable(phaseMethodDecisionId: string): boolean {
    return (
      this.process.getPhaseMethodDecisionByExecutionNumber(this.executionIndex)
        ?.id === phaseMethodDecisionId
    );
  }

  toDb(): RunningPhaseProcessEntry {
    const db = super.toDb() as RunningFullProcessEntry & {
      process: BmPhaseProcessEntry;
    };
    return {
      ...db,
      executionIndex: this.executionIndex,
    };
  }
}

export function isRunningPhaseProcess(
  runningProcess: RunningProcess
): runningProcess is RunningPhaseProcess {
  const runningPhaseProcess = runningProcess as RunningPhaseProcess;
  return (
    runningPhaseProcess.process != null &&
    isBmPhaseProcess(runningPhaseProcess.process)
  );
}

export function isRunningPhaseProcessEntry(
  runningProcess: RunningProcessEntry
): runningProcess is RunningPhaseProcessEntry {
  const runningPhaseProcess = runningProcess as RunningPhaseProcessEntry;
  return (
    runningPhaseProcess.process != null &&
    isBmPhaseProcessEntry(runningPhaseProcess.process)
  );
}

export function isRunningPhaseProcessInit(
  runningProcess: RunningProcessInit
): runningProcess is RunningPhaseProcessInit {
  const runningPhaseProcess = runningProcess as RunningPhaseProcessInit;
  return (
    runningPhaseProcess.process != null &&
    isBmPhaseProcessInit(runningPhaseProcess.process)
  );
}
