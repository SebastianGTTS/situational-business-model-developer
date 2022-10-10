import { Injectable } from '@angular/core';
import { RunningProcess } from '../../development-process-registry/running-process/running-process';
import { RunningProcessService } from '../../development-process-registry/running-process/running-process.service';
import { ElementLoaderService } from '../../database/element-loader.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import PouchDB from 'pouchdb-browser';

@Injectable()
export class RunningProcessLoaderService extends ElementLoaderService {
  runningProcess?: RunningProcess;

  error = false;
  errorStatus?: number;
  errorReason?: string;

  constructor(
    private runningProcessService: RunningProcessService,
    route: ActivatedRoute
  ) {
    super(route);
  }

  protected initParams(paramMap: ParamMap): void {
    const runningProcessId = paramMap.get('id');
    if (runningProcessId != null) {
      this.changesFeed = this.runningProcessService
        .getChangesFeed(runningProcessId)
        .subscribe(() => this.loadRunningProcess(runningProcessId));
      void this.loadRunningProcess(runningProcessId);
    } else {
      this.runningProcess = undefined;
    }
  }

  private async loadRunningProcess(runningProcessId: string): Promise<void> {
    try {
      this.runningProcess = await this.runningProcessService.get(
        runningProcessId
      );
    } catch (error) {
      const pouchDbError = error as PouchDB.Core.Error;
      this.runningProcess = undefined;
      this.error = true;
      this.errorStatus = pouchDbError.status;
      this.errorReason = pouchDbError.reason;
      console.error(error);
      return;
    }
    this.elementLoaded();
  }
}
