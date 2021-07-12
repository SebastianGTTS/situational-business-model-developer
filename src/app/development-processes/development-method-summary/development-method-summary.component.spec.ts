import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevelopmentMethodSummaryComponent } from './development-method-summary.component';

describe('DevelopmentMethodSummaryComponent', () => {
  let component: DevelopmentMethodSummaryComponent;
  let fixture: ComponentFixture<DevelopmentMethodSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevelopmentMethodSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevelopmentMethodSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
