import { BmProcessService } from './bm-process.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { PouchdbService } from '../../database/pouchdb.service';

describe('BmProcessService', () => {
  let spectator: SpectatorService<BmProcessService>;
  const createService = createServiceFactory({
    service: BmProcessService,
    providers: [],
    entryComponents: [],
    mocks: [PouchdbService],
  });

  beforeEach(() => spectator = createService());

  it('should be created', () => {
    expect(spectator.inject(BmProcessService)).toBeTruthy();
  });
});
