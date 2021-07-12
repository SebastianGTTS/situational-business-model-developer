import { TestBed } from '@angular/core/testing';

import { CanvasMetaModelService } from './canvas-meta-model.service';

describe('CanvasMetaModelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CanvasMetaModelService = TestBed.get(CanvasMetaModelService);
    expect(service).toBeTruthy();
  });
});
