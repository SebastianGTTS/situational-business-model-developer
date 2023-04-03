import { Component } from '@angular/core';
import { RunningProcessLoaderService } from '../../shared/running-process-loader.service';
import { RunningProcess } from '../../../development-process-registry/running-process/running-process';

@Component({
  selector: 'app-running-process',
  templateUrl: './running-process.component.html',
  styleUrls: ['./running-process.component.css'],
  providers: [RunningProcessLoaderService],
})
export class RunningProcessComponent {
  constructor(
    private runningProcessLoaderService: RunningProcessLoaderService
  ) {}

  get runningProcess(): RunningProcess | undefined {
    return this.runningProcessLoaderService.runningProcess;
  }

  get error(): boolean {
    return this.runningProcessLoaderService.error;
  }

  get errorStatus(): number | undefined {
    return this.runningProcessLoaderService.errorStatus;
  }

  get errorReason(): string | undefined {
    return this.runningProcessLoaderService.errorReason;
  }
}
