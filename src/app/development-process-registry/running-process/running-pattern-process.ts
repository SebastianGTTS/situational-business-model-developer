import {
  RunningFullProcess,
  RunningFullProcessEntry,
  RunningFullProcessInit,
} from './running-full-process';
import {
  BmPatternProcess,
  BmPatternProcessEntry,
  BmPatternProcessInit,
  isBmPatternProcess,
  isBmPatternProcessEntry,
  isBmPatternProcessInit,
} from '../bm-process/bm-pattern-process';
import { RunningMethod } from './running-method';
import { Step } from './step';
import {
  RunningProcess,
  RunningProcessEntry,
  RunningProcessInit,
} from './running-process';

export interface RunningPatternProcessInit extends RunningFullProcessInit {
  process: BmPatternProcessInit;
}

export interface RunningPatternProcessEntry extends RunningFullProcessEntry {
  process: BmPatternProcessEntry;
}

export class RunningPatternProcess extends RunningFullProcess {
  process: BmPatternProcess;

  constructor(
    entry: RunningPatternProcessEntry | undefined,
    init: RunningPatternProcessInit | undefined
  ) {
    super(entry, init);
    if (entry != null) {
      this.process = new BmPatternProcess(entry.process, undefined);
    } else if (init != null) {
      this.process = new BmPatternProcess(undefined, init.process);
    } else {
      throw new Error('Either entry or init must be provided.');
    }
  }

  /**
   * Add a running method of the bm process to the currently executed methods list
   *
   * @param nodeId the id of the node
   * @return the added running method
   */
  addRunningMethodOfProcess(nodeId: string): RunningMethod {
    const method = new RunningMethod(undefined, {
      nodeId,
      decision: this.process.decisions[nodeId],
      steps: this.process.decisions[nodeId].method.executionSteps.map(
        () => new Step(undefined, {})
      ),
    });
    this.addRunningMethod(method);
    return method;
  }

  /**
   * Checks whether a method to execute is defined for the node
   *
   * @param nodeId the id of the node
   * @return true if a method is defined
   */
  isExecutable(nodeId: string): boolean {
    return nodeId in this.process.decisions;
  }

  toDb(): RunningPatternProcessEntry {
    return super.toDb() as RunningFullProcessEntry & {
      process: BmPatternProcessEntry;
    };
  }
}

export function isRunningPatternProcess(
  runningProcess: RunningProcess
): runningProcess is RunningPatternProcess {
  const runningPatternProcess = runningProcess as RunningPatternProcess;
  return (
    runningPatternProcess.process != null &&
    isBmPatternProcess(runningPatternProcess.process)
  );
}

export function isRunningPatternProcessEntry(
  runningProcess: RunningProcessEntry
): runningProcess is RunningPatternProcessEntry {
  const runningPatternProcess = runningProcess as RunningPatternProcessEntry;
  return (
    runningPatternProcess.process != null &&
    isBmPatternProcessEntry(runningPatternProcess.process)
  );
}

export function isRunningPatternProcessInit(
  runningProcess: RunningProcessInit
): runningProcess is RunningPatternProcessInit {
  const runningPatternProcess = runningProcess as RunningPatternProcessInit;
  return (
    runningPatternProcess.process != null &&
    isBmPatternProcessInit(runningPatternProcess.process)
  );
}
