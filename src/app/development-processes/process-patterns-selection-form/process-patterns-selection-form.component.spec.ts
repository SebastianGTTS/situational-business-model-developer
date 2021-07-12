import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessPatternsSelectionFormComponent } from './process-patterns-selection-form.component';

describe('ProcessPatternsSelectionFormComponent', () => {
  let component: ProcessPatternsSelectionFormComponent;
  let fixture: ComponentFixture<ProcessPatternsSelectionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessPatternsSelectionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessPatternsSelectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
