import { TestBed, async, inject } from '@angular/core/testing';

import { DiagramChangeGuard } from './diagram-change.guard';

describe('DiagramChangeGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DiagramChangeGuard]
    });
  });

  it('should ...', inject([DiagramChangeGuard], (guard: DiagramChangeGuard) => {
    expect(guard).toBeTruthy();
  }));
});
