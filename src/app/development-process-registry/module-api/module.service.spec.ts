import { TestBed } from '@angular/core/testing';

import { ModuleService } from './module.service';

describe('ModuleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModuleService = TestBed.get(ModuleService);
    expect(service).toBeTruthy();
  });
});
