import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeholdersGroupInfoComponent } from './stakeholders-group-info.component';

describe('StakeholdersGroupInfoComponent', () => {
  let component: StakeholdersGroupInfoComponent;
  let fixture: ComponentFixture<StakeholdersGroupInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StakeholdersGroupInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeholdersGroupInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
