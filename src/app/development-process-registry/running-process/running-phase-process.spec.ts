import {
  isRunningPhaseProcessEntry,
  RunningPhaseProcess,
} from './running-phase-process';
import { BmPhaseProcessInit } from '../bm-process/bm-phase-process';

describe('RunningPhaseProcess', () => {
  const testProcess: BmPhaseProcessInit = {
    name: 'Test Process',
    initial: false,
    phases: [
      {
        phase: {
          name: 'Phase 1',
        },
        decisions: [
          {
            id: 'second',
            number: 2,
            decision: {
              method: {
                name: 'Test Method 2',
                author: {},
              },
            },
          },
        ],
      },
      {
        phase: {
          name: 'Phase 2',
        },
        decisions: [
          {
            id: 'first',
            number: 1,
            decision: {
              method: {
                name: 'Test Method 1',
                author: {},
              },
            },
          },
        ],
      },
    ],
  };

  it('should create', () => {
    const runningProcess = new RunningPhaseProcess(undefined, {
      name: 'Test Running Process',
      process: testProcess,
    });
    expect(runningProcess).toBeTruthy();
    expect(runningProcess.executionIndex).toBe(1);
    const db = runningProcess.toDb();
    expect(db).toBeTruthy();
    expect(isRunningPhaseProcessEntry(db)).toBe(true);
    expect(db.executionIndex).toBe(1);
  });

  it('is executable', () => {
    const runningProcess = new RunningPhaseProcess(undefined, {
      name: 'Test Running Process',
      process: testProcess,
    });
    expect(runningProcess.isExecutable('first')).toBe(true);
    expect(runningProcess.isExecutable('second')).toBe(false);
    runningProcess.executionIndex += 1;
    expect(runningProcess.isExecutable('first')).toBe(false);
    expect(runningProcess.isExecutable('second')).toBe(true);
  });

  it('can add method to running methods', () => {
    const runningProcess = new RunningPhaseProcess(undefined, {
      name: 'Test Running Process',
      process: testProcess,
    });
    const method = runningProcess.addRunningMethodOfProcess('first');
    expect(runningProcess.getRunningMethod(method.executionId)).toBe(method);
    expect(runningProcess.getMethod(method.executionId)).toBe(method);
  });
});
