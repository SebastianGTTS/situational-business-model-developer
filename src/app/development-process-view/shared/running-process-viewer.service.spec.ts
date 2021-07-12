import { TestBed } from '@angular/core/testing';

import { RunningProcessViewerService } from './running-process-viewer.service';

describe('RunningProcessViewerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RunningProcessViewerService = TestBed.get(RunningProcessViewerService);
    expect(service).toBeTruthy();
  });
});
