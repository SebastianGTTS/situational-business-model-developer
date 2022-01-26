import { ProcessPattern } from './process-pattern';

describe('ProcessPattern', () => {
  it('should create', () => {
    const processPattern = new ProcessPattern(undefined, {
      name: 'Test Pattern',
    });
    expect(processPattern).toBeTruthy();
    expect(processPattern.name).toBe('Test Pattern');
    expect(processPattern.author).toBeTruthy();
  });
});
