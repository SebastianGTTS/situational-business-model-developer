import {
  createServiceFactory,
  SpectatorService,
  SpyObject,
} from '@ngneat/spectator/jest';
import { PouchdbService } from '../../../database/pouchdb.service';
import { ArtifactService } from './artifact.service';
import { Artifact } from './artifact';

describe('Artifact Service', () => {
  let spectator: SpectatorService<ArtifactService>;
  let pouchdbService: SpyObject<PouchdbService>;

  const createService = createServiceFactory({
    service: ArtifactService,
    mocks: [PouchdbService],
  });

  beforeEach(() => {
    spectator = createService();
    pouchdbService = spectator.inject(PouchdbService);
  });

  it('should add artifacts', async () => {
    await spectator.service.add({
      list: 'Test List',
      name: 'Test Artifact',
    });
    expect(pouchdbService.post).toHaveBeenCalled();
    expect(pouchdbService.post.mock.calls).toHaveLength(1);
    const artifact: Artifact = pouchdbService.post.mock.calls[0][0];
    expect(artifact).toBeTruthy();
    expect(artifact).toBeInstanceOf(Artifact);
    expect(artifact.list).toBe('Test List');
    expect(artifact.name).toBe('Test Artifact');
    expect(artifact.internalArtifact).toBe(false);
  });
});
