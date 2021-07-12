import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessPatternSelectionFormComponent } from './process-pattern-selection-form.component';

describe('ProcessPatternSelectionFormComponent', () => {
  let component: ProcessPatternSelectionFormComponent;
  let fixture: ComponentFixture<ProcessPatternSelectionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessPatternSelectionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessPatternSelectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
