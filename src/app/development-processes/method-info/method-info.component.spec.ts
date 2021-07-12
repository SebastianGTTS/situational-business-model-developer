import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodInfoComponent } from './method-info.component';

describe('MethodInfoComponent', () => {
  let component: MethodInfoComponent;
  let fixture: ComponentFixture<MethodInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MethodInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
