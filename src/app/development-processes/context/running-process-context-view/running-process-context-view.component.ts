import { Component, Input, ViewChild } from '@angular/core';
import {
  ContextChangeRunningProcess,
  RunningFullProcess,
  RunningFullProcessInit,
} from '../../../development-process-registry/running-process/running-full-process';
import { Domain } from '../../../development-process-registry/knowledge/domain';
import { SelectionInit } from '../../../development-process-registry/development-method/selection';
import { SituationalFactorInit } from '../../../development-process-registry/method-elements/situational-factor/situational-factor';
import { UPDATABLE, Updatable } from '../../../shared/updatable';
import { ContextEditComponent } from '../context-edit/context-edit.component';
import { RunningProcessContextServiceBase } from '../../../development-process-registry/running-process/running-process-context.service';

@Component({
  selector: 'app-running-process-context-view',
  templateUrl: './running-process-context-view.component.html',
  styleUrls: ['./running-process-context-view.component.css'],
  providers: [
    { provide: UPDATABLE, useExisting: RunningProcessContextViewComponent },
  ],
})
export class RunningProcessContextViewComponent<
  T extends RunningFullProcess,
  S extends RunningFullProcessInit
> implements Updatable
{
  @Input() runningProcess!: ContextChangeRunningProcess;

  @ViewChild(ContextEditComponent) contextEdit!: Updatable;

  constructor(
    private runningProcessContextService: RunningProcessContextServiceBase<T, S>
  ) {}

  update(): void {
    this.contextEdit.update();
  }

  async updateDomains(domains: Domain[]): Promise<void> {
    if (this.runningProcess != null) {
      await this.runningProcessContextService.updateDomains(
        this.runningProcess._id,
        domains
      );
    }
  }

  async updateSituationalFactors(
    situationalFactors: SelectionInit<SituationalFactorInit>[]
  ): Promise<void> {
    if (this.runningProcess != null) {
      await this.runningProcessContextService.updateSituationalFactors(
        this.runningProcess._id,
        situationalFactors
      );
    }
  }

  async applySuggestion(): Promise<void> {
    if (this.runningProcess != null) {
      await this.runningProcessContextService.updateDomains(
        this.runningProcess._id,
        this.runningProcess.contextChangeInfo.suggestedDomains
      );
      await this.runningProcessContextService.updateSituationalFactors(
        this.runningProcess._id,
        this.runningProcess.contextChangeInfo.suggestedSituationalFactors
      );
    }
  }
}
