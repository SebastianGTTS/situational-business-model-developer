import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SituationalFactorsOverviewComponent } from './situational-factors-overview.component';

describe('SituationalFactorsOverviewComponent', () => {
  let component: SituationalFactorsOverviewComponent;
  let fixture: ComponentFixture<SituationalFactorsOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SituationalFactorsOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SituationalFactorsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
