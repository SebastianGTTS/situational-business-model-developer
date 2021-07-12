import { SituationalFactorService } from './situational-factor.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { PouchdbService } from '../../../database/pouchdb.service';

describe('SituationalFactorService', () => {
  let spectator: SpectatorService<SituationalFactorService>;
  const createService = createServiceFactory({
    service: SituationalFactorService,
    providers: [],
    entryComponents: [],
    mocks: [PouchdbService],
  });

  beforeEach(() => spectator = createService());

  it('should be created', () => {
    expect(spectator.inject(SituationalFactorService)).toBeTruthy();
  });
});
