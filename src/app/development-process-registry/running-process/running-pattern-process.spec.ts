import {
  isRunningPatternProcessEntry,
  RunningPatternProcess,
} from './running-pattern-process';

describe('RunningPatternProcess', () => {
  it('should create', () => {
    const runningProcess = new RunningPatternProcess(undefined, {
      name: 'Test Running Process',
      process: {
        name: 'Test Process',
        processDiagram: 'TEST DIAGRAM',
      },
    });
    expect(runningProcess).toBeTruthy();
    const db = runningProcess.toDb();
    expect(db).toBeTruthy();
    expect(isRunningPatternProcessEntry(db)).toBe(true);
  });
});
