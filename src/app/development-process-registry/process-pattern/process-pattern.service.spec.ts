import { ProcessPatternService } from './process-pattern.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { PouchdbService } from '../../database/pouchdb.service';

describe('ProcessPatternService', () => {
  let spectator: SpectatorService<ProcessPatternService>;
  const createService = createServiceFactory({
    service: ProcessPatternService,
    providers: [],
    entryComponents: [],
    mocks: [PouchdbService],
  });

  beforeEach(() => spectator = createService());

  it('should be created', () => {
    expect(spectator.inject(ProcessPatternService)).toBeTruthy();
  });
});
