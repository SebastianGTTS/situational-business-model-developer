import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodElementGroupInfoComponent } from './method-element-group-info.component';

describe('MethodElementGroupInfoComponent', () => {
  let component: MethodElementGroupInfoComponent;
  let fixture: ComponentFixture<MethodElementGroupInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MethodElementGroupInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodElementGroupInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
