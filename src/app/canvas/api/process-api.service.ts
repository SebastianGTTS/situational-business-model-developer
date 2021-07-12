import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { RunningProcess } from '../../development-process-registry/running-process/running-process';
import { RunningMethod } from '../../development-process-registry/running-process/running-method';
import { StepInfo } from '../../development-process-registry/module-api/step-info';
import { RunningProcessService } from '../../development-process-registry/running-process/running-process.service';

@Injectable({
  providedIn: 'root'
})
export class ProcessApiService {

  runningProcess: RunningProcess = null;
  runningMethod: RunningMethod = null;

  stepInfo: StepInfo = null;

  private querySubscription: Subscription = null;

  constructor(
    private runningProcessService: RunningProcessService,
  ) {
  }

  init(route: ActivatedRoute) {
    if (this.querySubscription != null) {
      console.warn('QuerySubscription already activated');
      this.querySubscription.unsubscribe();
    }
    this.querySubscription = route.queryParamMap.subscribe((params) => {
      this.stepInfo = {
        step: params.has('step') ? +params.get('step') : undefined,
        runningProcessId: params.get('runningProcessId'),
        executionId: params.has('executionId') ? params.get('executionId') : undefined,
      };
      this.loadProcessInfo().then();
    });
  }

  destroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
      this.querySubscription = null;
      this.runningProcess = null;
      this.runningMethod = null;
      this.stepInfo = null;
    }
  }

  isInitialized(): boolean {
    return this.runningProcess != null;
  }

  get queryParams() {
    return {
      step: this.stepInfo.step != null ? this.stepInfo.step : undefined,
      runningProcessId: this.runningProcess._id,
      executionId: this.runningMethod != null ? this.runningMethod.executionId : undefined,
    };
  }

  private async loadProcessInfo() {
    this.runningProcess = await this.runningProcessService.getRunningProcess(this.stepInfo.runningProcessId);
    this.runningMethod = this.runningProcess.getRunningMethod(this.stepInfo.executionId);
  }

}
