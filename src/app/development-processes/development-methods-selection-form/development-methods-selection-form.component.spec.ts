import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevelopmentMethodsSelectionFormComponent } from './development-methods-selection-form.component';

describe('DevelopmentMethodsSelectionFormComponent', () => {
  let component: DevelopmentMethodsSelectionFormComponent;
  let fixture: ComponentFixture<DevelopmentMethodsSelectionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevelopmentMethodsSelectionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevelopmentMethodsSelectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
