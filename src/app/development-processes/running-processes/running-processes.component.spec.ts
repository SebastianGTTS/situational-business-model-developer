import { RunningProcessesComponent } from './running-processes.component';
import { createRoutingFactory, Spectator } from '@ngneat/spectator';
import { RunningProcessService } from '../../development-process-registry/running-process/running-process.service';

describe('RunningProcessesComponent', () => {
  let spectator: Spectator<RunningProcessesComponent>;
  const createComponent = createRoutingFactory({
    component: RunningProcessesComponent,
    declarations: [],
    detectChanges: false,
    mocks: [RunningProcessService],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.inject(RunningProcessService).getRunningProcessesList.and.returnValue(Promise.resolve([]));
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });
});
