import { HypoMoMapTreeService } from './hypo-mo-map-tree.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { PouchdbService } from '../../../database/pouchdb.service';

describe('HypoMoMapTreeService', () => {
  let spectator: SpectatorService<HypoMoMapTreeService>;
  const createService = createServiceFactory({
    service: HypoMoMapTreeService,
    providers: [],
    entryComponents: [],
    mocks: [PouchdbService],
  });

  beforeEach(() => (spectator = createService()));

  it('should be created', () => {
    expect(spectator.inject(HypoMoMapTreeService)).toBeTruthy();
  });
});
