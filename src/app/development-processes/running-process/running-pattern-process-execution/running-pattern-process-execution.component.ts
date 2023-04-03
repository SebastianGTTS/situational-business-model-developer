import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RunningProcessViewerComponent } from '../../../development-process-view/running-process-viewer/running-process-viewer.component';
import { RunningPatternProcessService } from '../../../development-process-registry/running-process/running-pattern-process.service';
import { BpmnFlowNode } from 'bpmn-js';
import { ExecutionErrors } from '../../../development-process-registry/running-process/process-execution.service';
import { RunningProcessLoaderService } from '../../shared/running-process-loader.service';
import { RunningPatternProcess } from '../../../development-process-registry/running-process/running-pattern-process';
import { Subscription } from 'rxjs';
import { RunningProcessAskFinishModalComponent } from '../running-process-ask-finish-modal/running-process-ask-finish-modal.component';
import { filter } from 'rxjs/operators';
import { RunningProcessFinishModalComponent } from '../running-process-finish-modal/running-process-finish-modal.component';

@Component({
  selector: 'app-running-pattern-process-execution',
  templateUrl: './running-pattern-process-execution.component.html',
  styleUrls: ['./running-pattern-process-execution.component.scss'],
})
export class RunningPatternProcessExecutionComponent
  implements OnInit, OnDestroy
{
  decisions: BpmnFlowNode[] = []; // node decisions

  private modalReference?: NgbModalRef;

  @ViewChild(RunningProcessViewerComponent)
  runningProcessViewer!: RunningProcessViewerComponent;
  @ViewChild('multipleOptionsInfoModal', { static: true })
  multipleOptionsInfoModal: unknown;

  private loadedSubscription?: Subscription;

  constructor(
    private modalService: NgbModal,
    private runningPatternProcessService: RunningPatternProcessService,
    private runningProcessLoaderService: RunningProcessLoaderService
  ) {}

  ngOnInit(): void {
    this.loadedSubscription = this.runningProcessLoaderService.loaded.subscribe(
      () => this.loadDecisions()
    );
  }

  ngOnDestroy(): void {
    this.loadedSubscription?.unsubscribe();
  }

  async loadDecisions(): Promise<void> {
    if (this.runningProcess != null) {
      this.decisions =
        await this.runningPatternProcessService.getExecutableDecisionNodes(
          this.runningProcess
        );
    }
  }

  async startNodeExecution(nodeId: string): Promise<void> {
    if (this.runningProcess != null) {
      await this.runningPatternProcessService.startMethodExecution(
        this.runningProcess._id,
        nodeId
      );
    }
  }

  async executeStep(nodeId: string): Promise<void> {
    if (this.runningProcess != null) {
      const runningProcess = this.runningProcess;
      const selectedFlow = this.runningProcessViewer.getSelectedFlow();
      try {
        const hasMethodsLeft =
          await this.runningPatternProcessService.executeStepAndJump(
            this.runningProcess._id,
            nodeId,
            selectedFlow ? selectedFlow.id : undefined
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
              this.runningPatternProcessService.finishRunningProcess(
                runningProcess._id,
                conclusion
              )
            );
          });
        }
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === ExecutionErrors.MULTIPLE_OPTIONS
        ) {
          this.focus(nodeId);
          this.modalReference = this.modalService.open(
            this.multipleOptionsInfoModal,
            { size: 'lg' }
          );
        } else {
          throw error;
        }
      }
    }
  }

  focus(id: string): void {
    this.runningProcessViewer.focus(id);
  }

  get runningProcess(): RunningPatternProcess | undefined {
    return this.runningProcessLoaderService.runningPatternProcess;
  }
}
