import { Component } from '@angular/core';
import { RunningProcessLoaderService } from '../../shared/running-process-loader.service';
import { RunningLightProcess } from '../../../development-process-registry/running-process/running-light-process';

@Component({
  selector: 'app-running-light-process-execution',
  templateUrl: './running-light-process-execution.component.html',
  styleUrls: ['./running-light-process-execution.component.scss'],
})
export class RunningLightProcessExecutionComponent {
  constructor(
    private runningProcessLoaderService: RunningProcessLoaderService
  ) {}

  get runningProcess(): RunningLightProcess | undefined {
    return this.runningProcessLoaderService.runningLightProcess;
  }
}
