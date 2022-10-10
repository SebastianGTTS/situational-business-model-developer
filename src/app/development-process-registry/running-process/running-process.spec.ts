import { RunningProcess } from './running-process';

describe('RunningProcess', () => {
  it('should create', () => {
    const runningProcess = new RunningProcess(undefined, {
      name: 'Test Running Process',
      process: {
        name: 'Test Process',
        processDiagram: '',
      },
    });
    expect(runningProcess).toBeTruthy();
    expect(runningProcess.name).toBe('Test Running Process');
    expect(runningProcess.process).toBeTruthy();
    expect(runningProcess.process?.name).toBe('Test Process');
    expect(runningProcess.contextChange).toBe(false);
  });
});
