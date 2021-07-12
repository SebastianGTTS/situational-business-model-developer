import { TestBed } from '@angular/core/testing';

import { BpmnViewerService } from './bpmn-viewer.service';

describe('BpmnViewerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BpmnViewerService = TestBed.get(BpmnViewerService);
    expect(service).toBeTruthy();
  });
});
