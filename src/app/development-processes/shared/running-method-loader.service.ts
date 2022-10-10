import { Injectable } from '@angular/core';
import { RunningProcessLoaderService } from './running-process-loader.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { RunningMethod } from '../../development-process-registry/running-process/running-method';
import { RunningProcessService } from '../../development-process-registry/running-process/running-process.service';

@Injectable()
export class RunningMethodLoaderService extends RunningProcessLoaderService {
  runningMethod?: RunningMethod;
  private executionId?: string;

  constructor(
    runningProcessService: RunningProcessService,
    route: ActivatedRoute
  ) {
    super(runningProcessService, route);
    this.loaded.subscribe(() => this.loadRunningMethod());
  }

  protected initParams(paramMap: ParamMap): void {
    this.executionId = paramMap.get('executionId') ?? undefined;
    super.initParams(paramMap);
  }

  private loadRunningMethod(): void {
    this.runningMethod = this.runningProcess?.getRunningMethod(
      this.executionId
    );
  }
}
