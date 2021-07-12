import { TestBed } from '@angular/core/testing';

import { StakeholderService } from './stakeholder.service';

describe('StakeholderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StakeholderService = TestBed.get(StakeholderService);
    expect(service).toBeTruthy();
  });
});
