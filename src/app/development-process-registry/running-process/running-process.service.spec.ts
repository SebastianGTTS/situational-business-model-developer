import { RunningProcessService } from './running-process.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { PouchdbService } from '../../database/pouchdb.service';
import { DevelopmentMethodService } from '../development-method/development-method.service';

describe('RunningProcessService', () => {
  let spectator: SpectatorService<RunningProcessService>;
  const createService = createServiceFactory({
    service: RunningProcessService,
    providers: [],
    entryComponents: [],
    mocks: [DevelopmentMethodService, PouchdbService],
  });

  beforeEach(() => spectator = createService());

  it('should be created', () => {
    expect(spectator.inject(RunningProcessService)).toBeTruthy();
  });
});
