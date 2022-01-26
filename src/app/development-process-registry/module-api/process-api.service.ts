import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { RunningProcess } from '../running-process/running-process';
import { RunningMethod } from '../running-process/running-method';
import { StepInfo } from './step-info';
import { RunningProcessService } from '../running-process/running-process.service';

/**
 * Helper for components to know which process is currently executed.
 * Should be included as provider in api components.
 */
@Injectable()
export class ProcessApiService implements OnDestroy {
  private _loadedObservable: Observable<void>;
  private _loaded: Subject<void>;
  get loaded(): Observable<void> {
    return this._loadedObservable;
  }

  runningProcess: RunningProcess = null;
  runningMethod: RunningMethod = null;
  errorLoading = false;

  stepInfo: StepInfo = null;

  private querySubscription: Subscription = null;
  private changesFeed: Subscription = null;

  constructor(
    private route: ActivatedRoute,
    private runningProcessService: RunningProcessService
  ) {
    this.init();
  }

  private init(): void {
    this._loaded = new Subject<void>();
    this._loadedObservable = this._loaded.asObservable();
    this.querySubscription = this.route.queryParamMap.subscribe((params) => {
      this.stepInfo = {
        step: params.has('step') ? +params.get('step') : undefined,
        runningProcessId: params.has('runningProcessId')
          ? params.get('runningProcessId')
          : undefined,
        executionId: params.has('executionId')
          ? params.get('executionId')
          : undefined,
      };
      this.checkUnsubscribeChangesFeed();
      if (this.stepInfo.runningProcessId != null) {
        this.changesFeed = this.runningProcessService
          .getChangesFeed(this.stepInfo.runningProcessId)
          .subscribe(() => this.loadProcessInfo());
        void this.loadProcessInfo();
      }
    });
  }

  ngOnDestroy(): void {
    this.checkUnsubscribeChangesFeed();
    this.querySubscription.unsubscribe();
    this._loaded.complete();
  }

  isInitialized(): boolean {
    return this.runningProcess != null;
  }

  isCorrectStep(): boolean {
    return this.runningMethod.currentStepNumber === this.stepInfo.step;
  }

  get queryParams(): {
    step: number;
    runningProcessId: string;
    executionId: string;
  } {
    return {
      step: this.stepInfo.step != null ? this.stepInfo.step : undefined,
      runningProcessId: this.runningProcess
        ? this.runningProcess._id
        : undefined,
      executionId:
        this.runningMethod != null ? this.runningMethod.executionId : undefined,
    };
  }

  private async loadProcessInfo(): Promise<void> {
    try {
      this.runningProcess = await this.runningProcessService.get(
        this.stepInfo.runningProcessId
      );
    } catch (error) {
      console.error(error);
      this.errorLoading = true;
      this.runningProcess = null;
      this.runningMethod = null;
      return;
    }
    this.runningMethod = this.runningProcess.getRunningMethod(
      this.stepInfo.executionId
    );
    if (this.runningMethod == null) {
      this.errorLoading = true;
      this.runningMethod = null;
    } else {
      this._loaded.next();
    }
  }

  private checkUnsubscribeChangesFeed(): void {
    if (this.changesFeed) {
      this.changesFeed.unsubscribe();
      this.changesFeed = null;
    }
  }
}
