import {
  RunningProcess,
  RunningProcessEntry,
  RunningProcessInit,
} from './running-process';
import { SituationalFactor } from '../method-elements/situational-factor/situational-factor';
import { Domain } from '../knowledge/domain';
import { Selection } from '../development-method/selection';

class TestRunningProcess extends RunningProcess {
  constructor(
    entry: RunningProcessEntry | undefined,
    init: RunningProcessInit | undefined
  ) {
    super(entry, init);
  }

  get situationalFactors(): Selection<SituationalFactor>[] {
    return [];
  }

  get domains(): Domain[] {
    return [];
  }
}

describe('RunningProcess', () => {
  it('should create', () => {
    const runningProcess = new TestRunningProcess(undefined, {
      name: 'Test Running Process',
    });
    expect(runningProcess).toBeTruthy();
    expect(runningProcess.name).toBe('Test Running Process');
  });
});
