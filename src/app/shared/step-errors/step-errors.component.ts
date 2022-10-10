import { Component } from '@angular/core';
import { ProcessApiService } from '../../development-process-registry/module-api/process-api.service';
import { RunningProcess } from '../../development-process-registry/running-process/running-process';
import { RunningMethod } from '../../development-process-registry/running-process/running-method';
import { StepInfo } from '../../development-process-registry/module-api/step-info';

@Component({
  selector: 'app-step-errors',
  templateUrl: './step-errors.component.html',
  styleUrls: ['./step-errors.component.css'],
})
export class StepErrorsComponent {
  constructor(private processApiService: ProcessApiService) {}

  get runningProcess(): RunningProcess | undefined {
    return this.processApiService.runningProcess;
  }

  get runningMethod(): RunningMethod | undefined {
    return this.processApiService.runningMethod;
  }

  get stepInfo(): StepInfo | undefined {
    return this.processApiService.stepInfo;
  }

  get errorLoading(): boolean {
    return this.processApiService.errorLoading;
  }

  get isCorrectStep(): boolean {
    return this.processApiService.isCorrectStep();
  }
}
