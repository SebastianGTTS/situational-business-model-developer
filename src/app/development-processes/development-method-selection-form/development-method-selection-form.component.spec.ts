import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevelopmentMethodSelectionFormComponent } from './development-method-selection-form.component';

describe('DevelopmentMethodSelectionFormComponent', () => {
  let component: DevelopmentMethodSelectionFormComponent;
  let fixture: ComponentFixture<DevelopmentMethodSelectionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevelopmentMethodSelectionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevelopmentMethodSelectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
