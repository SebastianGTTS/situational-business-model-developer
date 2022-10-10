import { EmptyExecutionStep } from './empty-execution-step';

describe('EmptyExecutionStep', () => {
  it('should create', () => {
    const emptyExecutionStep = new EmptyExecutionStep(undefined, {
      name: 'An empty execution step',
      description: 'This is the description of an empty execution step.',
    });
    expect(emptyExecutionStep).toBeTruthy();
    expect(emptyExecutionStep.name).toBe('An empty execution step');
    expect(emptyExecutionStep.description).toBe(
      'This is the description of an empty execution step.'
    );
  });
});
