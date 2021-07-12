import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SituationalFactorSelectionFormComponent } from './situational-factor-selection-form.component';

describe('SituationalFactorSelectionFormComponent', () => {
  let component: SituationalFactorSelectionFormComponent;
  let fixture: ComponentFixture<SituationalFactorSelectionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SituationalFactorSelectionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SituationalFactorSelectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
