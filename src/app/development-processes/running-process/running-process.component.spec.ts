import { RunningProcessComponent } from './running-process.component';
import { createRoutingFactory, Spectator } from '@ngneat/spectator';
import { MockComponent } from 'ng-mocks';
import { RunningProcessViewerComponent } from '../../development-process-view/running-process-viewer/running-process-viewer.component';
import { RunningProcessService } from '../../development-process-registry/running-process/running-process.service';
import { RunningProcess } from '../../development-process-registry/running-process/running-process';

describe('RunningProcessComponent', () => {
  let spectator: Spectator<RunningProcessComponent>;
  const createComponent = createRoutingFactory({
    component: RunningProcessComponent,
    declarations: [
      MockComponent(RunningProcessViewerComponent),
    ],
    detectChanges: false,
    mocks: [RunningProcessService],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.inject(RunningProcessService).getRunningProcess.and.returnValue(
      Promise.resolve(new RunningProcess({name: 'Test running Process'}))
    );
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });
});
