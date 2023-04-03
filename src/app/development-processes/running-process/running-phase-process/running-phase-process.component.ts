import { Component, OnDestroy, OnInit } from '@angular/core';
import { RunningPhaseProcess } from '../../../development-process-registry/running-process/running-phase-process';
import { RunningProcessServiceBase } from '../../../development-process-registry/running-process/running-process.service';
import { RunningFullProcessServiceBase } from '../../../development-process-registry/running-process/running-full-process.service';
import { RunningPhaseProcessService } from '../../../development-process-registry/running-process/running-phase-process.service';
import { RunningProcessLoaderService } from '../../shared/running-process-loader.service';
import { asapScheduler, Subscription } from 'rxjs';
import { RunningPhaseProcessTutorialService } from './running-phase-process-tutorial.service';
import { ActivatedRoute } from '@angular/router';
import { subscribeOn } from 'rxjs/operators';

@Component({
  selector: 'app-running-phase-process',
  templateUrl: './running-phase-process.component.html',
  styleUrls: ['./running-phase-process.component.css'],
  providers: [
    {
      provide: RunningProcessServiceBase,
      useExisting: RunningPhaseProcessService,
    },
    {
      provide: RunningFullProcessServiceBase,
      useExisting: RunningPhaseProcessService,
    },
    RunningPhaseProcessTutorialService,
  ],
})
export class RunningPhaseProcessComponent implements OnInit, OnDestroy {
  private loadedSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private runningPhaseProcessTutorialService: RunningPhaseProcessTutorialService,
    private runningProcessLoaderService: RunningProcessLoaderService
  ) {}

  ngOnInit(): void {
    this.loadedSubscription = this.runningProcessLoaderService.loaded
      .pipe(subscribeOn(asapScheduler))
      .subscribe(() => {
        if (!this.runningProcess?.completed) {
          void this.runningPhaseProcessTutorialService.init(
            this.route.snapshot.queryParamMap.get('created') === 'true',
            this.route.snapshot.queryParamMap.get('tutorial') === 'true',
            this.route.snapshot.queryParamMap.get('finishedMethod') === 'true'
          );
        }
        this.loadedSubscription?.unsubscribe();
        this.loadedSubscription = undefined;
      });
  }

  ngOnDestroy(): void {
    this.loadedSubscription?.unsubscribe();
  }

  get runningProcess(): RunningPhaseProcess | undefined {
    return this.runningProcessLoaderService.runningPhaseProcess;
  }
}
