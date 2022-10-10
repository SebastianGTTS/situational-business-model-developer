import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { RunningProcess } from '../running-process/running-process';
import { RunningMethod } from '../running-process/running-method';
import { StepInfo } from './step-info';
import { RunningProcessService } from '../running-process/running-process.service';
import { ApiQueryParams } from './api-query-params';
import { ArtifactVersionId } from '../running-process/artifact-version';

/**
 * Helper for components to know which process is currently executed.
 * Should be included as provider in api components.
 */
@Injectable()
export class ProcessApiService implements OnDestroy {
  private readonly _loadedObservable: Observable<void>;
  private readonly _loaded: Subject<void>;
  get loaded(): Observable<void> {
    return this._loadedObservable;
  }

  runningProcess?: RunningProcess;
  runningMethod?: RunningMethod;
  errorLoading = false;

  stepInfo?: StepInfo;
  artifactVersionId?: ArtifactVersionId;

  private querySubscription: Subscription;
  private changesFeed?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private runningProcessService: RunningProcessService
  ) {
    this._loaded = new Subject<void>();
    this._loadedObservable = this._loaded.asObservable();
    this.querySubscription = this.route.queryParamMap.subscribe((params) => {
      this.artifactVersionId = params.get('artifactVersionId') ?? undefined;
      const stepStr = params.get('step');
      const step = stepStr != null ? +stepStr : undefined;
      this.stepInfo = {
        step: step ?? undefined,
        runningProcessId: params.get('runningProcessId') ?? undefined,
        executionId: params.get('executionId') ?? undefined,
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
    return this.runningMethod?.currentStepNumber === this.stepInfo?.step;
  }

  get queryParams(): ApiQueryParams {
    return {
      step: this.stepInfo?.step != null ? this.stepInfo.step : undefined,
      runningProcessId: this.runningProcess
        ? this.runningProcess._id
        : undefined,
      executionId:
        this.runningMethod != null ? this.runningMethod.executionId : undefined,
      artifactVersionId: this.artifactVersionId,
    };
  }

  private async loadProcessInfo(): Promise<void> {
    if (this.stepInfo == null) {
      throw new Error('Step Info is null');
    }
    try {
      if (this.stepInfo.runningProcessId == null) {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error('runningProcessId is undefined');
      }
      this.runningProcess = await this.runningProcessService.get(
        this.stepInfo.runningProcessId
      );
    } catch (error) {
      console.error(error);
      this.errorLoading = true;
      this.runningProcess = undefined;
      this.runningMethod = undefined;
      return;
    }
    this.runningMethod = this.runningProcess.getRunningMethod(
      this.stepInfo.executionId
    );
    if (this.runningMethod == null) {
      this.errorLoading = true;
      this.runningMethod = undefined;
    } else {
      this._loaded.next();
    }
  }

  private checkUnsubscribeChangesFeed(): void {
    if (this.changesFeed != null) {
      this.changesFeed.unsubscribe();
      this.changesFeed = undefined;
    }
  }
}
