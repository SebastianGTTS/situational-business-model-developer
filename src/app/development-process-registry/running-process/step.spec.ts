import { Step } from './step';

describe('Step', () => {
  it('should create', () => {
    const step = new Step(undefined, {});
    expect(step.inputArtifacts).toBeFalsy();
    expect(step.outputArtifacts).toBeFalsy();
  });
});
