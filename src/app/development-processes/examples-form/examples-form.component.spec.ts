import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamplesFormComponent } from './examples-form.component';

describe('ExamplesFormComponent', () => {
  let component: ExamplesFormComponent;
  let fixture: ComponentFixture<ExamplesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamplesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamplesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
