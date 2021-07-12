import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodElementInfoComponent } from './method-element-info.component';

describe('MethodElementInfoComponent', () => {
  let component: MethodElementInfoComponent;
  let fixture: ComponentFixture<MethodElementInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MethodElementInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodElementInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
