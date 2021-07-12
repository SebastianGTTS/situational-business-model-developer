import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeholdersSelectionFormComponent } from './stakeholders-selection-form.component';

describe('StakeholdersSelectionFormComponent', () => {
  let component: StakeholdersSelectionFormComponent;
  let fixture: ComponentFixture<StakeholdersSelectionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StakeholdersSelectionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeholdersSelectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
