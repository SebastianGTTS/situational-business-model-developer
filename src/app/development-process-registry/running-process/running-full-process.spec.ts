import {
  isRunningFullProcessEntry,
  RunningFullProcess,
  RunningFullProcessEntry,
  RunningFullProcessInit,
} from './running-full-process';
import {
  BmProcess,
  BmProcessEntry,
  BmProcessInit,
} from '../bm-process/bm-process';
import { RunningMethod } from './running-method';
import { ContextChangeInfo } from './context-change-info';

class TestRunningFullProcess extends RunningFullProcess {
  process: BmProcess;

  constructor(
    entry: (RunningFullProcessEntry & { process: BmProcessEntry }) | undefined,
    init: (RunningFullProcessInit & { process: BmProcessInit }) | undefined
  ) {
    super(entry, init);
    if (entry != null) {
      this.process = new BmProcess(entry.process, undefined);
    } else if (init != null) {
      this.process = new BmProcess(undefined, init.process);
    } else {
      throw new Error('Either entry or init must be provided.');
    }
  }

  addRunningMethodOfProcess(): RunningMethod {
    throw new Error('Not implemented');
  }

  isExecutable(): boolean {
    throw new Error('Not implemented');
  }
}

describe('RunningFullProcess', () => {
  it('should create', () => {
    const runningProcess = new TestRunningFullProcess(undefined, {
      name: 'Test Process',
      process: {
        name: 'Test',
      },
    });
    expect(runningProcess).toBeTruthy();
    expect(runningProcess.isContextChange()).toBe(false);
    expect(runningProcess.contextChangeInfo).toBeFalsy();
    const db = runningProcess.toDb();
    expect(db).toBeTruthy();
    expect(isRunningFullProcessEntry(db)).toBe(true);
    expect(db.contextChange).toBe(false);
  });

  it('can enter context change mode', () => {
    const runningProcess = new TestRunningFullProcess(undefined, {
      name: 'Test Process',
      process: {
        name: 'Test',
      },
    });
    runningProcess.contextChange = true;
    runningProcess.contextChangeInfo = new ContextChangeInfo(undefined, {
      comment: 'Test',
      suggestedDomains: [],
      suggestedSituationalFactors: [],
      oldDomains: runningProcess.process.domains,
      oldSituationalFactors: runningProcess.process.situationalFactors,
    });
    expect(runningProcess.isContextChange()).toBe(true);
    expect(runningProcess.contextChangeInfo).toBeTruthy();
  });
});
