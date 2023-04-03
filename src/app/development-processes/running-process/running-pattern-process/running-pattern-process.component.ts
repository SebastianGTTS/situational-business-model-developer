import { Component, OnDestroy, OnInit } from '@angular/core';
import { RunningPatternProcess } from '../../../development-process-registry/running-process/running-pattern-process';
import { RunningPatternProcessService } from '../../../development-process-registry/running-process/running-pattern-process.service';
import { RunningProcessServiceBase } from '../../../development-process-registry/running-process/running-process.service';
import { RunningFullProcessServiceBase } from '../../../development-process-registry/running-process/running-full-process.service';
import { RunningProcessLoaderService } from '../../shared/running-process-loader.service';
import { RunningPatternProcessTutorialService } from './running-pattern-process-tutorial.service';
import { asapScheduler, Subscription } from 'rxjs';
import { subscribeOn } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-running-pattern-process',
  templateUrl: './running-pattern-process.component.html',
  styleUrls: ['./running-pattern-process.component.css'],
  providers: [
    {
      provide: RunningProcessServiceBase,
      useExisting: RunningPatternProcessService,
    },
    {
      provide: RunningFullProcessServiceBase,
      useExisting: RunningPatternProcessService,
    },
    RunningPatternProcessTutorialService,
  ],
})
export class RunningPatternProcessComponent implements OnInit, OnDestroy {
  private loadedSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private runningPatternProcessTutorialService: RunningPatternProcessTutorialService,
    private runningProcessLoaderService: RunningProcessLoaderService
  ) {}

  ngOnInit(): void {
    this.loadedSubscription = this.runningProcessLoaderService.loaded
      .pipe(subscribeOn(asapScheduler))
      .subscribe(() => {
        if (!this.runningProcess?.completed) {
          void this.runningPatternProcessTutorialService.init(
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

  get runningProcess(): RunningPatternProcess | undefined {
    return this.runningProcessLoaderService.runningPatternProcess;
  }
}
