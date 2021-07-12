import { PouchdbService } from './pouchdb.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

describe('PouchdbService', () => {
  let spectator: SpectatorService<PouchdbService>;
  const createService = createServiceFactory(PouchdbService);

  beforeEach(() => spectator = createService());

  it('should be created', () => {
    expect(spectator.inject(PouchdbService)).toBeTruthy();
  });
});
