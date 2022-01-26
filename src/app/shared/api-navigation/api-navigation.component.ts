import { Component, Input } from '@angular/core';
import { ProcessApiService } from '../../development-process-registry/module-api/process-api.service';
import { RunningProcess } from '../../development-process-registry/running-process/running-process';
import { RunningMethod } from '../../development-process-registry/running-process/running-method';

@Component({
  selector: 'app-api-navigation',
  templateUrl: './api-navigation.component.html',
  styleUrls: ['./api-navigation.component.css'],
})
export class ApiNavigationComponent {
  @Input() apiName?: string;

  constructor(private processApiService: ProcessApiService) {}

  get runningProcess(): RunningProcess {
    return this.processApiService.runningProcess;
  }

  get runningMethod(): RunningMethod {
    return this.processApiService.runningMethod;
  }

  get queryParams(): {
    step: number;
    runningProcessId: string;
    executionId: string;
  } {
    return this.processApiService.queryParams;
  }
}
