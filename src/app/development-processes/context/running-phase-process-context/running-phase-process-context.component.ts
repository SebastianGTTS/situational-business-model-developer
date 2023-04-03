import { Component, Input, ViewChild } from '@angular/core';
import { Steps } from '../running-process-context/running-process-context.component';
import { ContextChangeRunningProcess } from '../../../development-process-registry/running-process/running-full-process';
import { RunningPhaseProcess } from '../../../development-process-registry/running-process/running-phase-process';
import { RunningProcessContextServiceBase } from '../../../development-process-registry/running-process/running-process-context.service';
import { RunningPhaseProcessContextService } from '../../../development-process-registry/running-process/running-phase-process-context.service';
import { UPDATABLE, Updatable } from '../../../shared/updatable';
import { RunningProcessContextViewComponent } from '../running-process-context-view/running-process-context-view.component';
import {
  RunningPatternProcess,
  RunningPatternProcessInit,
} from '../../../development-process-registry/running-process/running-pattern-process';
import { RunningPhaseProcessContextEditComponent } from '../running-phase-process-context-edit/running-phase-process-context-edit.component';

@Component({
  selector: 'app-running-phase-process-context',
  templateUrl: './running-phase-process-context.component.html',
  styleUrls: ['./running-phase-process-context.component.css'],
  providers: [
    {
      provide: RunningProcessContextServiceBase,
      useExisting: RunningPhaseProcessContextService,
    },
    { provide: UPDATABLE, useExisting: RunningPhaseProcessContextComponent },
  ],
})
export class RunningPhaseProcessContextComponent implements Updatable {
  @Input() activeStep!: Steps;
  @Input() runningProcess!: RunningPhaseProcess & ContextChangeRunningProcess;

  @ViewChild(RunningProcessContextViewComponent)
  runningProcessContextViewComponent?: RunningProcessContextViewComponent<
    RunningPatternProcess,
    RunningPatternProcessInit
  >;
  @ViewChild(RunningPhaseProcessContextEditComponent)
  runningPhaseProcessContextEditComponent?: RunningPhaseProcessContextEditComponent;

  update(): void {
    this.runningProcessContextViewComponent?.update();
    this.runningPhaseProcessContextEditComponent?.update();
  }

  get steps(): typeof Steps {
    return Steps;
  }
}
