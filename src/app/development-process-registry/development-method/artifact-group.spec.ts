import { ArtifactGroup } from './artifact-group';

describe('Artifact Group', () => {
  it('should create', () => {
    const artifactGroup = new ArtifactGroup(undefined, {});
    expect(artifactGroup).toBeTruthy();
    expect(artifactGroup.items).toStrictEqual([]);
  });
});
