import { StepArtifact } from './step-artifact';
import { ArtifactDataType } from './artifact-data';

describe('Step Artifact', () => {
  it('should be created', () => {
    const stepArtifact = new StepArtifact(undefined, {
      identifier: 'Test',
      artifact: {
        list: 'TestList',
        name: 'TestArtifact',
      },
      data: {},
    });
    expect(stepArtifact.identifier).toBe('Test');
    expect(stepArtifact.artifact.internalArtifact).toBe(false);
    expect(stepArtifact.data.type).toBe(ArtifactDataType.STRING);
  });
});
