import { Injectable } from '@angular/core';
import { RunningProcess } from '../../development-process-registry/running-process/running-process';
import { RunningProcessService } from '../../development-process-registry/running-process/running-process.service';
import { ElementLoaderService } from '../../database/element-loader.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Injectable()
export class RunningProcessLoaderService extends ElementLoaderService {
  runningProcess: RunningProcess;

  error: boolean;
  errorStatus: number;
  errorReason: string;

  constructor(
    private runningProcessService: RunningProcessService,
    route: ActivatedRoute
  ) {
    super(route);
  }

  protected initParams(paramMap: ParamMap): void {
    const runningProcessId = paramMap.get('id');
    this.changesFeed = this.runningProcessService
      .getChangesFeed(runningProcessId)
      .subscribe(() => this.loadRunningProcess(runningProcessId));
    void this.loadRunningProcess(runningProcessId);
  }

  private async loadRunningProcess(runningProcessId: string): Promise<void> {
    try {
      this.runningProcess = await this.runningProcessService.get(
        runningProcessId
      );
    } catch (error) {
      this.runningProcess = null;
      this.error = true;
      this.errorStatus = error.status;
      this.errorReason = error.reason;
      console.error(error);
      return;
    }
    this.elementLoaded();
  }
}
