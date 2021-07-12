import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevelopmentMethodSelectExecutionStepsComponent } from './development-method-select-execution-steps.component';

describe('DevelopmentMethodSelectExecutionStepsComponent', () => {
  let component: DevelopmentMethodSelectExecutionStepsComponent;
  let fixture: ComponentFixture<DevelopmentMethodSelectExecutionStepsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevelopmentMethodSelectExecutionStepsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevelopmentMethodSelectExecutionStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
