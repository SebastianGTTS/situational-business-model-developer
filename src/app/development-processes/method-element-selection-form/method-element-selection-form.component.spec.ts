import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodElementSelectionFormComponent } from './method-element-selection-form.component';

describe('MethodElementSelectionFormComponent', () => {
  let component: MethodElementSelectionFormComponent;
  let fixture: ComponentFixture<MethodElementSelectionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MethodElementSelectionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodElementSelectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
