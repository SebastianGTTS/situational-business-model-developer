import { Artifact } from './artifact';

describe('Artifact', () => {
  let artifact: Artifact;

  beforeEach(() => {
    artifact = new Artifact({name: 'Test Artifact'});
  });

  it('should be created', () => expect(artifact).toBeTruthy());
});
