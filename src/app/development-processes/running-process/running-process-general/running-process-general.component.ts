import { Component, QueryList, ViewChildren } from '@angular/core';
import {
  RunningProcess,
  RunningProcessInit,
} from '../../../development-process-registry/running-process/running-process';
import { RunningProcessLoaderService } from '../../shared/running-process-loader.service';
import { RunningProcessServiceBase } from '../../../development-process-registry/running-process/running-process.service';
import { IconInit } from '../../../model/icon';
import { Updatable, UPDATABLE } from '../../../shared/updatable';

@Component({
  selector: 'app-running-process-general',
  templateUrl: './running-process-general.component.html',
  styleUrls: ['./running-process-general.component.scss'],
  providers: [
    { provide: UPDATABLE, useExisting: RunningProcessGeneralComponent },
  ],
})
export class RunningProcessGeneralComponent<
  T extends RunningProcess,
  S extends RunningProcessInit
> implements Updatable
{
  @ViewChildren(UPDATABLE) updatable!: QueryList<Updatable>;

  constructor(
    private runningProcessService: RunningProcessServiceBase<T, S>,
    private runningProcessLoaderService: RunningProcessLoaderService
  ) {}

  async updateInfo(name: string, description: string): Promise<void> {
    if (this.runningProcess != null) {
      await this.runningProcessService.updateInfo(
        this.runningProcess._id,
        name,
        description
      );
    }
  }

  async updateIcon(icon: IconInit): Promise<void> {
    if (this.runningProcess != null) {
      await this.runningProcessService.updateIcon(
        this.runningProcess._id,
        icon
      );
    }
  }

  update(): void {
    for (const updatable of this.updatable) {
      updatable.update();
    }
  }

  get runningProcess(): RunningProcess | undefined {
    return this.runningProcessLoaderService.runningProcess;
  }
}
