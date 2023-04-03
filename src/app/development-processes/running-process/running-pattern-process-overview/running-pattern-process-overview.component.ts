import { Component } from '@angular/core';
import { RunningPatternProcess } from '../../../development-process-registry/running-process/running-pattern-process';
import { RunningProcessLoaderService } from '../../shared/running-process-loader.service';

@Component({
  selector: 'app-running-pattern-process-overview',
  templateUrl: './running-pattern-process-overview.component.html',
  styleUrls: ['./running-pattern-process-overview.component.scss'],
})
export class RunningPatternProcessOverviewComponent {
  constructor(
    private runningProcessLoaderService: RunningProcessLoaderService
  ) {}

  get runningProcess(): RunningPatternProcess | undefined {
    return this.runningProcessLoaderService.runningPatternProcess;
  }
}
