import { Component, ViewChild } from '@angular/core';
import { RunningProcessLoaderService } from '../../shared/running-process-loader.service';
import { RunningLightProcess } from '../../../development-process-registry/running-process/running-light-process';
import { Domain } from '../../../development-process-registry/knowledge/domain';
import { SelectionInit } from '../../../development-process-registry/development-method/selection';
import { SituationalFactorInit } from '../../../development-process-registry/method-elements/situational-factor/situational-factor';
import { RunningLightProcessService } from '../../../development-process-registry/running-process/running-light-process.service';
import { ContextEditComponent } from '../../context/context-edit/context-edit.component';
import { UPDATABLE, Updatable } from '../../../shared/updatable';

@Component({
  selector: 'app-running-light-process-context',
  templateUrl: './running-light-process-context.component.html',
  styleUrls: ['./running-light-process-context.component.scss'],
  providers: [
    { provide: UPDATABLE, useExisting: RunningLightProcessContextComponent },
  ],
})
export class RunningLightProcessContextComponent implements Updatable {
  @ViewChild(ContextEditComponent) contextEditComponent?: ContextEditComponent;

  constructor(
    private runningLightProcessService: RunningLightProcessService,
    private runningProcessLoaderService: RunningProcessLoaderService
  ) {}

  async updateDomains(domains: Domain[]): Promise<void> {
    if (this.runningProcess != null) {
      await this.runningLightProcessService.updateDomains(
        this.runningProcess._id,
        domains
      );
    }
  }

  async updateSituationalFactors(
    situationalFactors: SelectionInit<SituationalFactorInit>[]
  ): Promise<void> {
    if (this.runningProcess != null) {
      await this.runningLightProcessService.updateSituationalFactors(
        this.runningProcess._id,
        situationalFactors
      );
    }
  }

  update(): void {
    this.contextEditComponent?.update();
  }

  get runningProcess(): RunningLightProcess | undefined {
    return this.runningProcessLoaderService.runningLightProcess;
  }
}
