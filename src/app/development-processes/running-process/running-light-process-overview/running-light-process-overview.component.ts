import { Component } from '@angular/core';
import { RunningProcessLoaderService } from '../../shared/running-process-loader.service';
import { RunningLightProcess } from '../../../development-process-registry/running-process/running-light-process';

@Component({
  selector: 'app-running-light-process-overview',
  templateUrl: './running-light-process-overview.component.html',
  styleUrls: ['./running-light-process-overview.component.scss'],
})
export class RunningLightProcessOverviewComponent {
  constructor(
    private runningProcessLoaderService: RunningProcessLoaderService
  ) {}

  get runningProcess(): RunningLightProcess | undefined {
    return this.runningProcessLoaderService.runningLightProcess;
  }
}
