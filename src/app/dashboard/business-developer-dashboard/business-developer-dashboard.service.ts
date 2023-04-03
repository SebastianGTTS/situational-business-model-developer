import { Injectable } from '@angular/core';
import { PouchdbService } from '../../database/pouchdb.service';
import { RunningProcess } from '../../development-process-registry/running-process/running-process';
import { RunningArtifact } from '../../development-process-registry/running-process/running-artifact';
import { StatsService } from '../../stats.service';
import { RunningProcessService } from '../../development-process-registry/running-process/running-process.service';
import {
  DevelopmentProcessesStats,
  DevelopmentProcessesStatsService,
} from '../../development-processes/shared/development-processes-stats.service';

@Injectable()
export class BusinessDeveloperDashboardService {
  private _numberRunningMethods?: number;

  get numberOfRunningMethods(): number | undefined {
    return this._numberRunningMethods;
  }

  private _numberCompletedMethods?: number;

  get numberOfCompletedMethods(): number | undefined {
    return this._numberCompletedMethods;
  }

  private _numberArtifacts?: number;

  get numberOfArtifacts(): number | undefined {
    return this._numberArtifacts;
  }

  private _lastVisitedRunningProcess?: RunningProcess;

  get lastVisitedRunningProcess(): RunningProcess | undefined {
    return this._lastVisitedRunningProcess;
  }

  constructor(
    private pouchdbService: PouchdbService,
    private runningProcessService: RunningProcessService,
    private statsService: StatsService
  ) {
    this.load();
  }

  private load(): void {
    void this.loadRunningMethods();
    void this.loadCompletedMethods();
    void this.loadArtifacts();
    void this.loadLastVisitedRunningProcess();
  }

  private async loadRunningMethods(): Promise<void> {
    this._numberRunningMethods = (
      await this.pouchdbService.find(RunningProcess.typeName, {
        fields: [],
        selector: {
          $not: {
            completed: true,
          },
        },
      })
    ).length;
  }

  private async loadCompletedMethods(): Promise<void> {
    this._numberCompletedMethods = (
      await this.pouchdbService.find(RunningProcess.typeName, {
        fields: [],
        selector: {
          completed: true,
        },
      })
    ).length;
  }

  private async loadArtifacts(): Promise<void> {
    this._numberArtifacts = (
      await this.pouchdbService.find(RunningArtifact.typeName, {
        fields: [],
        selector: {},
      })
    ).length;
  }

  private async loadLastVisitedRunningProcess(): Promise<void> {
    const stats = this.statsService.stats?.getStat(
      DevelopmentProcessesStatsService.id
    ) as DevelopmentProcessesStats;
    if (stats == null || stats.lastVisitedRunningProcess == null) {
      return;
    }
    this._lastVisitedRunningProcess = await this.runningProcessService.get(
      stats.lastVisitedRunningProcess
    );
  }
}
