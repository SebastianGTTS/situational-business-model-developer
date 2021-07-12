import { ProcessPattern } from './process-pattern';

describe('ProcessPattern', () => {

  let processPattern: ProcessPattern;

  beforeEach(() => {
    processPattern = new ProcessPattern({name: 'Test Process Pattern'});
  });

  it('should be created', () => expect(processPattern).toBeTruthy());

});
