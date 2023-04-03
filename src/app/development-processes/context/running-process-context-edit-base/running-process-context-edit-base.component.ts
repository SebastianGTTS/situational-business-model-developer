import { Component, Input, ViewChild } from '@angular/core';
import {
  ContextChangeRunningProcess,
  RunningFullProcess,
  RunningFullProcessInit,
} from '../../../development-process-registry/running-process/running-full-process';
import { Domain } from '../../../development-process-registry/knowledge/domain';
import { SelectionInit } from '../../../development-process-registry/development-method/selection';
import { SituationalFactorInit } from '../../../development-process-registry/method-elements/situational-factor/situational-factor';
import { RunningProcessContextServiceBase } from '../../../development-process-registry/running-process/running-process-context.service';
import { ContextEditComponent } from '../context-edit/context-edit.component';
import { UPDATABLE, Updatable } from '../../../shared/updatable';

@Component({
  selector: 'app-running-process-context-edit-base',
  templateUrl: './running-process-context-edit-base.component.html',
  styleUrls: ['./running-process-context-edit-base.component.css'],
  providers: [
    { provide: UPDATABLE, useExisting: RunningProcessContextEditBaseComponent },
  ],
})
export class RunningProcessContextEditBaseComponent<
  T extends RunningFullProcess,
  S extends RunningFullProcessInit
> implements Updatable
{
  @Input() runningProcess!: T & ContextChangeRunningProcess;

  @ViewChild(ContextEditComponent) contextEditComponent!: Updatable;

  constructor(
    private runningProcessContextService: RunningProcessContextServiceBase<T, S>
  ) {}

  update(): void {
    this.contextEditComponent.update();
  }

  async removeRemovedMethod(id: string): Promise<void> {
    await this.runningProcessContextService.removeRemovedMethod(
      this.runningProcess._id,
      id
    );
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
}
