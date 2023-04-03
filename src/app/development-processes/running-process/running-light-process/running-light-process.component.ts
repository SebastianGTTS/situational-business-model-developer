import { Component, OnDestroy, OnInit } from '@angular/core';
import { RunningLightProcessService } from '../../../development-process-registry/running-process/running-light-process.service';
import { RunningProcessServiceBase } from '../../../development-process-registry/running-process/running-process.service';
import { RunningProcessLoaderService } from '../../shared/running-process-loader.service';
import { RunningLightProcess } from '../../../development-process-registry/running-process/running-light-process';
import { RunningLightProcessTutorialService } from './running-light-process-tutorial.service';
import { ActivatedRoute } from '@angular/router';
import { asapScheduler, Subscription } from 'rxjs';
import { subscribeOn } from 'rxjs/operators';

@Component({
  selector: 'app-running-light-process',
  templateUrl: './running-light-process.component.html',
  styleUrls: ['./running-light-process.component.css'],
  providers: [
    {
      provide: RunningProcessServiceBase,
      useExisting: RunningLightProcessService,
    },
    RunningLightProcessTutorialService,
  ],
})
export class RunningLightProcessComponent implements OnInit, OnDestroy {
  private loadedSubscription?: Subscription;
  private firstChange = true;

  constructor(
    private route: ActivatedRoute,
    private runningLightProcessTutorialService: RunningLightProcessTutorialService,
    private runningProcessLoaderService: RunningProcessLoaderService
  ) {}

  ngOnInit(): void {
    this.loadedSubscription = this.runningProcessLoaderService.loaded
      .pipe(subscribeOn(asapScheduler))
      .subscribe(() => {
        this.runningLightProcessTutorialService.setRunningProcess(
          this.runningProcess
        );
        if (this.firstChange) {
          this.firstChange = false;
          if (!this.runningProcess?.completed) {
            void this.runningLightProcessTutorialService.init(
              this.route.snapshot.queryParamMap.get('created') === 'true',
              this.route.snapshot.queryParamMap.get('tutorial') === 'true',
              this.route.snapshot.queryParamMap.get('finishedMethod') === 'true'
            );
            this.loadedSubscription?.unsubscribe();
            this.loadedSubscription = undefined;
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.loadedSubscription?.unsubscribe();
  }

  get runningProcess(): RunningLightProcess | undefined {
    return this.runningProcessLoaderService.runningLightProcess;
  }
}
