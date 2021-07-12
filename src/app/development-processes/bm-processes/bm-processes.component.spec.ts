import { BmProcessesComponent } from './bm-processes.component';
import { createRoutingFactory, Spectator } from '@ngneat/spectator';
import { ReactiveFormsModule } from '@angular/forms';
import { BmProcessService } from '../../development-process-registry/bm-process/bm-process.service';

describe('BmProcessesComponent', () => {
  let spectator: Spectator<BmProcessesComponent>;
  const createComponent = createRoutingFactory({
    component: BmProcessesComponent,
    declarations: [],
    detectChanges: false,
    imports: [ReactiveFormsModule],
    mocks: [BmProcessService],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.inject(BmProcessService).getBmProcessList.and.returnValue(Promise.resolve([]));
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });
});
