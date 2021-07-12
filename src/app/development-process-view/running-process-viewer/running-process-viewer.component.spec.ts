import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunningProcessViewerComponent } from './running-process-viewer.component';

describe('RunningProcessViewerComponent', () => {
  let component: RunningProcessViewerComponent;
  let fixture: ComponentFixture<RunningProcessViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunningProcessViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunningProcessViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
