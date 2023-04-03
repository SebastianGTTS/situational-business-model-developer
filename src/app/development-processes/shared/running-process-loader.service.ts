import { Injectable } from '@angular/core';
import { RunningProcess } from '../../development-process-registry/running-process/running-process';
import { ElementLoaderService } from '../../database/element-loader.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import PouchDB from 'pouchdb-browser';
import { RunningPhaseProcess } from '../../development-process-registry/running-process/running-phase-process';
import { RunningPatternProcess } from '../../development-process-registry/running-process/running-pattern-process';
import { RunningLightProcess } from '../../development-process-registry/running-process/running-light-process';
import { RunningFullProcess } from '../../development-process-registry/running-process/running-full-process';
import { RunningProcessTypesService } from '../../development-process-registry/running-process/running-process-types.service';

@Injectable()
export class RunningProcessLoaderService extends ElementLoaderService {
  runningProcess?: RunningProcess;
  runningFullProcess?: RunningFullProcess;
  runningPatternProcess?: RunningPatternProcess;
  runningPhaseProcess?: RunningPhaseProcess;
  runningLightProcess?: RunningLightProcess;

  error = false;
  errorStatus?: number;
  errorReason?: string;

  constructor(
    private runningProcessTypesService: RunningProcessTypesService,
    route: ActivatedRoute
  ) {
    super(route);
  }

  protected initParams(paramMap: ParamMap): void {
    const runningProcessId = paramMap.get('id');
    if (runningProcessId != null) {
      this.changesFeed = this.runningProcessTypesService
        .getChangesFeed(runningProcessId)
        .subscribe(() => this.loadRunningProcess(runningProcessId));
      void this.loadRunningProcess(runningProcessId);
    } else {
      this.runningProcess = undefined;
    }
  }

  private async loadRunningProcess(runningProcessId: string): Promise<void> {
    try {
      this.runningProcess = await this.runningProcessTypesService.get(
        runningProcessId
      );
      if (this.runningProcess instanceof RunningPatternProcess) {
        this.runningFullProcess = this.runningProcess;
        this.runningPatternProcess = this.runningProcess;
        this.runningPhaseProcess = undefined;
        this.runningLightProcess = undefined;
      } else if (this.runningProcess instanceof RunningPhaseProcess) {
        this.runningFullProcess = this.runningProcess;
        this.runningPatternProcess = undefined;
        this.runningPhaseProcess = this.runningProcess;
        this.runningLightProcess = undefined;
      } else if (this.runningProcess instanceof RunningLightProcess) {
        this.runningFullProcess = undefined;
        this.runningPatternProcess = undefined;
        this.runningPhaseProcess = undefined;
        this.runningLightProcess = this.runningProcess;
      } else {
        this.runningFullProcess = undefined;
        this.runningPatternProcess = undefined;
        this.runningPhaseProcess = undefined;
        this.runningLightProcess = undefined;
      }
    } catch (error) {
      const pouchDbError = error as PouchDB.Core.Error;
      this.runningProcess = undefined;
      this.runningFullProcess = undefined;
      this.runningPatternProcess = undefined;
      this.runningPhaseProcess = undefined;
      this.runningLightProcess = undefined;
      this.error = true;
      this.errorStatus = pouchDbError.status;
      this.errorReason = pouchDbError.reason;
      console.error(error);
      return;
    }
    this.elementLoaded();
  }
}
