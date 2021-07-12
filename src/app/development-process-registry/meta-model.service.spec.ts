import { TestBed } from '@angular/core/testing';

import { MetaModelService } from './meta-model.service';

describe('MetaModelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MetaModelService = TestBed.get(MetaModelService);
    expect(service).toBeTruthy();
  });
});
