import { TestBed } from '@angular/core/testing';

import { ExpertModelService } from './expert-model.service';

describe('ExpertModelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExpertModelService = TestBed.get(ExpertModelService);
    expect(service).toBeTruthy();
  });
});
