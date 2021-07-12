import { DevelopmentMethodService } from './development-method.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { PouchdbService } from '../../database/pouchdb.service';

describe('DevelopmentMethodService', () => {
  let spectator: SpectatorService<DevelopmentMethodService>;
  const createService = createServiceFactory({
    service: DevelopmentMethodService,
    providers: [],
    entryComponents: [],
    mocks: [PouchdbService],
  });

  beforeEach(() => spectator = createService());

  it('should be created', () => {
    expect(spectator.inject(DevelopmentMethodService)).toBeTruthy();
  });
});
