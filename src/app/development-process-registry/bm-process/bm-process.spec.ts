import { BmProcess } from './bm-process';

describe('BmProcess', () => {
  let bmProcess: BmProcess;

  beforeEach(() => {
    bmProcess = new BmProcess({name: 'Test Business Model Process'});
  });

  it('should be created', () => expect(bmProcess).toBeTruthy());
});
