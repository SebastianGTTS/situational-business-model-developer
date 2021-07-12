import { AutoCompletionService } from './auto-completion.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { PouchdbService } from './database/pouchdb.service';

describe('AutoCompletionService', () => {
  let spectator: SpectatorService<AutoCompletionService>;
  const createService = createServiceFactory({
    service: AutoCompletionService,
    providers: [],
    entryComponents: [],
    mocks: [PouchdbService],
  });

  beforeEach(() => spectator = createService());

  it('should be created', () => {
    expect(spectator.inject(AutoCompletionService)).toBeTruthy();
  });
});
