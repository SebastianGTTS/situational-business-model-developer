import { createExecutionStep, isMethodExecutionStep } from './execution-step';

describe('ExecutionStep', () => {
  it('should create', () => {
    const executionStep = createExecutionStep(undefined, {
      name: 'Empty step',
      description: 'Empty description',
    });
    expect(executionStep).toBeTruthy();
    expect(isMethodExecutionStep(executionStep)).toBe(false);
  });
});
