import { Component, Input, ViewChild } from '@angular/core';
import {
  RunningPatternProcess,
  RunningPatternProcessInit,
} from '../../../development-process-registry/running-process/running-pattern-process';
import { ContextChangeRunningProcess } from '../../../development-process-registry/running-process/running-full-process';
import { Steps } from '../running-process-context/running-process-context.component';
import { RunningProcessContextServiceBase } from '../../../development-process-registry/running-process/running-process-context.service';
import { RunningPatternProcessContextService } from '../../../development-process-registry/running-process/running-pattern-process-context.service';
import { UPDATABLE, Updatable } from '../../../shared/updatable';
import { DiagramComponentInterface } from '../../shared/diagram-component-interface';
import { RunningPatternProcessContextEditComponent } from '../running-pattern-process-context-edit/running-pattern-process-context-edit.component';
import { RunningProcessContextViewComponent } from '../running-process-context-view/running-process-context-view.component';

@Component({
  selector: 'app-running-pattern-process-context',
  templateUrl: './running-pattern-process-context.component.html',
  styleUrls: ['./running-pattern-process-context.component.css'],
  providers: [
    {
      provide: RunningProcessContextServiceBase,
      useExisting: RunningPatternProcessContextService,
    },
    { provide: UPDATABLE, useExisting: RunningPatternProcessContextComponent },
  ],
})
export class RunningPatternProcessContextComponent
  implements DiagramComponentInterface, Updatable
{
  @Input() activeStep!: Steps;
  @Input() runningProcess!: RunningPatternProcess & ContextChangeRunningProcess;

  @ViewChild(RunningProcessContextViewComponent)
  runningProcessContextViewComponent?: RunningProcessContextViewComponent<
    RunningPatternProcess,
    RunningPatternProcessInit
  >;
  @ViewChild(RunningPatternProcessContextEditComponent)
  runningPatternProcessContextEditComponent?: RunningPatternProcessContextEditComponent;

  async update(): Promise<void> {
    this.runningProcessContextViewComponent?.update();
    await this.runningPatternProcessContextEditComponent?.update();
  }

  async diagramChanged(): Promise<boolean> {
    return (
      this.runningPatternProcessContextEditComponent?.diagramChanged() ?? false
    );
  }

  async saveDiagram(): Promise<void> {
    await this.runningPatternProcessContextEditComponent?.saveDiagram();
  }

  get steps(): typeof Steps {
    return Steps;
  }
}
