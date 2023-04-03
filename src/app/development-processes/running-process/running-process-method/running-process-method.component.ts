import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RunningProcessService } from '../../../development-process-registry/running-process/running-process.service';
import { RunningProcess } from '../../../development-process-registry/running-process/running-process';
import { RunningMethod } from '../../../development-process-registry/running-process/running-method';
import { UntypedFormArray } from '@angular/forms';
import { OutputArtifactMappingFormService } from '../../shared/output-artifact-mapping-form.service';
import { Comment } from '../../../development-process-registry/running-process/comment';
import { ArtifactDataReference } from '../../../development-process-registry/running-process/artifact-data';
import { MetaArtifactApi } from '../../../development-process-registry/meta-artifact-definition';
import { RunningMethodLoaderService } from '../../shared/running-method-loader.service';
import {
  ExecutionStep,
  isMethodExecutionStep,
} from '../../../development-process-registry/development-method/execution-step';
import { MethodExecutionStep } from '../../../development-process-registry/development-method/method-execution-step';
import { RunningPatternProcess } from '../../../development-process-registry/running-process/running-pattern-process';
import { RunningPatternProcessService } from '../../../development-process-registry/running-process/running-pattern-process.service';
import { RunningPhaseProcess } from '../../../development-process-registry/running-process/running-phase-process';
import { RunningPhaseProcessService } from '../../../development-process-registry/running-process/running-phase-process.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RunningProcessAskFinishModalComponent } from '../running-process-ask-finish-modal/running-process-ask-finish-modal.component';
import { filter, subscribeOn } from 'rxjs/operators';
import { RunningProcessFinishModalComponent } from '../running-process-finish-modal/running-process-finish-modal.component';
import { RunningLightProcess } from '../../../development-process-registry/running-process/running-light-process';
import { RunningLightProcessService } from '../../../development-process-registry/running-process/running-light-process.service';
import { RunningProcessMethodTutorialService } from './running-process-method-tutorial.service';
import { RunningProcessMethod, State } from './running-process-method';
import { asapScheduler, Subscription } from 'rxjs';
import { TutorialManagerService } from '../../../tutorial/tutorial-manager.service';

@Component({
  selector: 'app-running-process-method',
  templateUrl: './running-process-method.component.html',
  styleUrls: ['./running-process-method.component.css'],
  providers: [RunningMethodLoaderService, RunningProcessMethodTutorialService],
})
export class RunningProcessMethodComponent
  implements OnInit, OnDestroy, RunningProcessMethod
{
  private loadedSubscription?: Subscription;

  constructor(
    private modalService: NgbModal,
    private outputArtifactMappingFormService: OutputArtifactMappingFormService,
    private route: ActivatedRoute,
    private router: Router,
    private runningLightProcessService: RunningLightProcessService,
    private runningMethodLoaderService: RunningMethodLoaderService,
    private runningPatternProcessService: RunningPatternProcessService,
    private runningPhaseProcessService: RunningPhaseProcessService,
    private runningProcessMethodTutorialService: RunningProcessMethodTutorialService,
    private runningProcessService: RunningProcessService,
    private tutorialManagerService: TutorialManagerService
  ) {}

  ngOnInit(): void {
    this.loadedSubscription = this.runningMethodLoaderService.loaded
      .pipe(subscribeOn(asapScheduler))
      .subscribe(() => {
        void this.runningProcessMethodTutorialService.init(
          this.route.snapshot.queryParamMap.get('created') === 'true',
          this.route.snapshot.queryParamMap.get('tutorial') === 'true',
          this
        );
        this.loadedSubscription?.unsubscribe();
        this.loadedSubscription = undefined;
      });
  }

  ngOnDestroy(): void {
    this.loadedSubscription?.unsubscribe();
  }

  async selectInputArtifacts(
    inputArtifactMapping: UntypedFormArray
  ): Promise<void> {
    if (this.runningProcess != null && this.runningMethod != null) {
      const inputArtifactMappingValue = inputArtifactMapping.value;
      const inputArtifactMap = (mapping: {
        artifact: number | null | undefined;
      }): { artifact: number | undefined; version: number | undefined } => {
        return {
          artifact: mapping.artifact ?? undefined,
          version:
            this.runningProcess != null && mapping.artifact != null
              ? this.runningProcess.artifacts[mapping.artifact].versions
                  .length - 1
              : undefined,
        };
      };
      await this.runningProcessService.setInputArtifacts(
        this.runningProcess._id,
        this.runningMethod.executionId,
        inputArtifactMappingValue.map(inputArtifactMap)
      );
    }
  }

  async executeMethodStep(): Promise<void> {
    if (this.runningProcess != null && this.runningMethod != null) {
      await this.runningProcessService.executeMethodStep(
        this.runningProcess._id,
        this.runningMethod.executionId
      );
    }
  }

  async updateOutputArtifacts(
    outputArtifactsMapping: UntypedFormArray
  ): Promise<void> {
    if (this.runningProcess != null && this.runningMethod != null) {
      const mapping = this.outputArtifactMappingFormService.get(
        outputArtifactsMapping.value
      );
      await this.runningProcessService.updateOutputArtifacts(
        this.runningProcess._id,
        this.runningMethod.executionId,
        mapping
      );
    }
  }

  async finishExecution(): Promise<void> {
    if (this.runningProcess != null && this.runningMethod != null) {
      const tutorialRunning = this.tutorialManagerService.isRunning();
      const runningProcess = this.runningProcess;
      let hasMethodsLeft: boolean;
      if (runningProcess instanceof RunningPatternProcess) {
        hasMethodsLeft =
          await this.runningPatternProcessService.stopMethodExecution(
            runningProcess._id,
            this.runningMethod.executionId
          );
        await this.runningPatternProcessService.jumpSteps(runningProcess._id);
      } else if (runningProcess instanceof RunningPhaseProcess) {
        hasMethodsLeft =
          await this.runningPhaseProcessService.stopMethodExecution(
            runningProcess._id,
            this.runningMethod.executionId
          );
      } else if (runningProcess instanceof RunningLightProcess) {
        hasMethodsLeft =
          await this.runningLightProcessService.stopMethodExecution(
            runningProcess._id,
            this.runningMethod.executionId
          );
      } else {
        hasMethodsLeft = await this.runningProcessService.stopMethodExecution(
          runningProcess._id,
          this.runningMethod.executionId
        );
      }
      await this.router.navigate(
        [
          'runningprocess',
          'runningprocessview',
          runningProcess._id,
          'light',
          'execution',
        ],
        {
          queryParams: {
            tutorial: tutorialRunning,
            finishedMethod: true,
          },
        }
      );
      if (!hasMethodsLeft) {
        const modal = this.modalService.open(
          RunningProcessAskFinishModalComponent,
          {
            size: 'lg',
          }
        );
        (
          modal.componentInstance as RunningProcessAskFinishModalComponent
        ).runningProcess = runningProcess;
        modal.closed.pipe(filter((value) => value)).subscribe(() => {
          const finishModal = this.modalService.open(
            RunningProcessFinishModalComponent,
            {
              size: 'lg',
            }
          );
          (
            finishModal.componentInstance as RunningProcessFinishModalComponent
          ).runningProcess = runningProcess;
          finishModal.closed.subscribe((conclusion) =>
            this.runningProcessService.finishRunningProcess(
              runningProcess._id,
              conclusion
            )
          );
        });
      }
    }
  }

  async abortMethodExecution(): Promise<void> {
    if (this.runningProcess != null && this.runningMethod != null) {
      await this.runningProcessService.abortMethodExecution(
        this.runningProcess._id,
        this.runningMethod.executionId
      );
      await this.router.navigate([
        'runningprocess',
        'runningprocessview',
        this.runningProcess._id,
      ]);
    }
  }

  async addComment(comment: Comment): Promise<void> {
    if (this.runningProcess != null && this.runningMethod != null) {
      await this.runningProcessService.addComment(
        this.runningProcess._id,
        this.runningMethod.executionId,
        comment
      );
    }
  }

  async updateComment(comment: Comment): Promise<void> {
    if (this.runningProcess != null && this.runningMethod != null) {
      await this.runningProcessService.updateComment(
        this.runningProcess._id,
        this.runningMethod.executionId,
        comment
      );
    }
  }

  async removeComment(commentId: string): Promise<void> {
    if (this.runningProcess != null && this.runningMethod != null) {
      await this.runningProcessService.removeComment(
        this.runningProcess._id,
        this.runningMethod.executionId,
        commentId
      );
    }
  }

  viewArtifactReference(
    reference: ArtifactDataReference,
    api: MetaArtifactApi
  ): void {
    if (this.runningProcess != null && this.runningMethod != null) {
      api.view(reference, this.router, {
        referenceType: 'Method',
        runningProcessId: this.runningProcess._id,
        executionId: this.runningMethod.executionId,
      });
    }
  }

  hasInputArtifacts(): boolean {
    const decision = this.runningMethod?.decision;
    const inputArtifacts =
      decision?.inputArtifacts.getSelectedElementsOptional();
    return inputArtifacts != null && inputArtifacts.length > 0;
  }

  hasStepsLeft(): boolean {
    return this.runningMethod?.hasStepsLeft() ?? false;
  }

  getState(): State {
    if (this.runningMethod != null) {
      if (this.runningMethod.inputArtifacts == null) {
        return State.INPUT_SELECTION;
      } else if (this.runningMethod.hasStepsLeft()) {
        return State.EXECUTION;
      } else {
        return State.OUTPUT_SELECTION;
      }
    }
    return State.LOADING;
  }

  getStateInputSelection(): State {
    return State.INPUT_SELECTION;
  }

  getStateExecution(): State {
    return State.EXECUTION;
  }

  getStateOutputSelection(): State {
    return State.OUTPUT_SELECTION;
  }

  get error(): boolean {
    return this.runningMethodLoaderService.error;
  }

  get errorStatus(): number | undefined {
    return this.runningMethodLoaderService.errorStatus;
  }

  get errorReason(): string | undefined {
    return this.runningMethodLoaderService.errorReason;
  }

  get runningProcess(): RunningProcess | undefined {
    return this.runningMethodLoaderService.runningProcess;
  }

  get runningMethod(): RunningMethod | undefined {
    return this.runningMethodLoaderService.runningMethod;
  }

  isMethodExecutionStep(step: ExecutionStep): step is MethodExecutionStep {
    return isMethodExecutionStep(step);
  }
}
