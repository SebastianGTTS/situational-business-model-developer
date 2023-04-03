import { Component } from '@angular/core';
import { RunningProcessLoaderService } from '../../shared/running-process-loader.service';
import { RunningPhaseProcess } from '../../../development-process-registry/running-process/running-phase-process';

@Component({
  selector: 'app-running-phase-process-overview',
  templateUrl: './running-phase-process-overview.component.html',
  styleUrls: ['./running-phase-process-overview.component.scss'],
})
export class RunningPhaseProcessOverviewComponent {
  constructor(
    private runningProcessLoaderService: RunningProcessLoaderService
  ) {}

  get runningProcess(): RunningPhaseProcess | undefined {
    return this.runningProcessLoaderService.runningPhaseProcess;
  }
}
