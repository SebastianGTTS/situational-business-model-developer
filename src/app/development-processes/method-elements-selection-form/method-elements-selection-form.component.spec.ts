import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodElementsSelectionFormComponent } from './method-elements-selection-form.component';

describe('MethodElementsSelectionFormComponent', () => {
  let component: MethodElementsSelectionFormComponent;
  let fixture: ComponentFixture<MethodElementsSelectionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MethodElementsSelectionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodElementsSelectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
