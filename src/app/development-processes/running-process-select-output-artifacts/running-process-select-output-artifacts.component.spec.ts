import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunningProcessSelectOutputArtifactsComponent } from './running-process-select-output-artifacts.component';

describe('RunningProcessSelectOutputArtifactsComponent', () => {
  let component: RunningProcessSelectOutputArtifactsComponent;
  let fixture: ComponentFixture<RunningProcessSelectOutputArtifactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunningProcessSelectOutputArtifactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunningProcessSelectOutputArtifactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
