import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatternInfoComponent } from './pattern-info.component';

describe('PatternInfoComponent', () => {
  let component: PatternInfoComponent;
  let fixture: ComponentFixture<PatternInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatternInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatternInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
