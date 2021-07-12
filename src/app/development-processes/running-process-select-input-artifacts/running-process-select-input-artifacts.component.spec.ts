import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunningProcessSelectInputArtifactsComponent } from './running-process-select-input-artifacts.component';

describe('RunningProcessSelectInputArtifactsComponent', () => {
  let component: RunningProcessSelectInputArtifactsComponent;
  let fixture: ComponentFixture<RunningProcessSelectInputArtifactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunningProcessSelectInputArtifactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunningProcessSelectInputArtifactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
