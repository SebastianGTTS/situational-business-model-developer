import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtifactsGroupInfoComponent } from './artifacts-group-info.component';

describe('ArtifactsGroupInfoComponent', () => {
  let component: ArtifactsGroupInfoComponent;
  let fixture: ComponentFixture<ArtifactsGroupInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtifactsGroupInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtifactsGroupInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
