import { RunningProcess } from './running-process';

describe('RunningProcess', () => {
  let runningProcess: RunningProcess;

  beforeEach(() => {
    runningProcess = new RunningProcess({name: 'Test RunningProcess'});
  });

  it('should be created', () => expect(runningProcess).toBeTruthy());
});
