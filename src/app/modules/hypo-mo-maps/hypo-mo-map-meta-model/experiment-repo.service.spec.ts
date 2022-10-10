import { ExperimentRepoService } from './experiment-repo.service';
import { PouchdbService } from '../../../database/pouchdb.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

describe('ExperimentRepoService', () => {
  let spectator: SpectatorService<ExperimentRepoService>;
  const createService = createServiceFactory({
    service: ExperimentRepoService,
    providers: [],
    entryComponents: [],
    mocks: [PouchdbService],
  });

  beforeEach(() => (spectator = createService()));

  it('should be created', () => {
    expect(spectator.inject(ExperimentRepoService)).toBeTruthy();
  });
});
