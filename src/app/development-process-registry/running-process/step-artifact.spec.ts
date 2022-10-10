import { StepArtifact } from './step-artifact';
import { ArtifactDataType } from './artifact-data';

describe('Step Artifact', () => {
  it('should be created', () => {
    const stepArtifact = new StepArtifact(undefined, {
      data: {
        data: 'Test',
      },
    });
    expect(stepArtifact.data.type).toBe(ArtifactDataType.STRING);
  });
});
