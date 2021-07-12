import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SituationalFactorsSelectionFormComponent } from './situational-factors-selection-form.component';

describe('SituationalFactorsSelectionFormComponent', () => {
  let component: SituationalFactorsSelectionFormComponent;
  let fixture: ComponentFixture<SituationalFactorsSelectionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SituationalFactorsSelectionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SituationalFactorsSelectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
