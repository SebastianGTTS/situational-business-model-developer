import { TestBed } from '@angular/core/testing';

import { BpmnService } from './bpmn.service';

describe('BpmnService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BpmnService = TestBed.get(BpmnService);
    expect(service).toBeTruthy();
  });
});
