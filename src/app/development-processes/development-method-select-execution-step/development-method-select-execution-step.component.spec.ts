import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevelopmentMethodSelectExecutionStepComponent } from './development-method-select-execution-step.component';

describe('DevelopmentMethodSelectExecutionStepComponent', () => {
  let component: DevelopmentMethodSelectExecutionStepComponent;
  let fixture: ComponentFixture<DevelopmentMethodSelectExecutionStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevelopmentMethodSelectExecutionStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevelopmentMethodSelectExecutionStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
