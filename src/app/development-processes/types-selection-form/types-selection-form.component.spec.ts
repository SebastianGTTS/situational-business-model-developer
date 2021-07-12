import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesSelectionFormComponent } from './types-selection-form.component';

describe('TypesSelectionFormComponent', () => {
  let component: TypesSelectionFormComponent;
  let fixture: ComponentFixture<TypesSelectionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypesSelectionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypesSelectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
