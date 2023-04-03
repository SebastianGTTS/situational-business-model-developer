import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { RunningPhaseProcessContextService } from '../../../development-process-registry/running-process/running-phase-process-context.service';
import { RunningPhaseProcess } from '../../../development-process-registry/running-process/running-phase-process';
import { ContextChangeRunningProcess } from '../../../development-process-registry/running-process/running-full-process';
import { PhaseRunningProcessBoardComponent } from '../../running-process/phase-running-process-board/phase-running-process-board.component';
import { MethodDecision } from '../../../development-process-registry/bm-process/method-decision';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DevelopmentMethodSummaryModal } from '../../development-method/development-method-summary-modal/development-method-summary-modal';
import { DevelopmentMethodSummaryModalComponent } from '../../development-method/development-method-summary-modal/development-method-summary-modal.component';
import { PhaseMethodDecision } from '../../../development-process-registry/bm-process/phase-method-decision';
import { RunningProcessContextFakeExecuteModalComponent } from '../running-process-context-fake-execute-modal/running-process-context-fake-execute-modal.component';
import { RunningProcessContextFakeExecuteModal } from '../running-process-context-fake-execute-modal/running-process-context-fake-execute-modal';
import { MissingArtifacts } from '../../../development-process-registry/bm-process/bm-phase-process.service';
import { Artifact } from '../../../development-process-registry/method-elements/artifact/artifact';

@Component({
  selector: 'app-running-phase-process-context-run',
  templateUrl: './running-phase-process-context-run.component.html',
  styleUrls: ['./running-phase-process-context-run.component.css'],
})
export class RunningPhaseProcessContextRunComponent implements OnChanges {
  @Input() runningProcess!: RunningPhaseProcess & ContextChangeRunningProcess;

  private modalReference?: NgbModalRef;

  executedDecisionIds: Set<string> = new Set<string>();
  missingArtifactsNodeIds?: Set<string>;
  missingArtifacts: {
    elementId: string;
    name: string;
    artifacts: Artifact[];
  }[] = [];

  @ViewChild(PhaseRunningProcessBoardComponent)
  phaseRunningProcessBoardComponent?: PhaseRunningProcessBoardComponent;
  @ViewChild('processBoard')
  processBoard?: ElementRef<HTMLDivElement>;

  constructor(
    private modalService: NgbModal,
    private runningPhaseProcessContextService: RunningPhaseProcessContextService
  ) {}

  focus(nodeId: string): void {
    this.phaseRunningProcessBoardComponent?.focusElement(nodeId);
    this.processBoard?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.runningProcess) {
      this.executedDecisionIds = new Set<string>(
        this.runningProcess.executedMethods
          .filter((method) => method.nodeId != null)
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          .map((method) => method.nodeId!)
      );
      void this.checkArtifacts();
    }
  }

  openInfoModal(decision: MethodDecision): void {
    this.modalReference = this.modalService.open(
      DevelopmentMethodSummaryModalComponent,
      {
        size: 'lg',
      }
    );
    const developmentMethodSummaryModal: DevelopmentMethodSummaryModal =
      this.modalReference.componentInstance;
    developmentMethodSummaryModal.methodDecision = decision;
  }

  async startExecution(
    phaseMethodDecision: PhaseMethodDecision
  ): Promise<void> {
    await this.runningPhaseProcessContextService.resetExecutionToPosition(
      this.runningProcess._id,
      phaseMethodDecision.id
    );
  }

  openFakeExecuteModal(nodeId: string): void {
    this.modalReference = this.modalService.open(
      RunningProcessContextFakeExecuteModalComponent,
      {
        size: 'lg',
      }
    );
    const modal: RunningProcessContextFakeExecuteModal =
      this.modalReference.componentInstance;
    modal.artifacts = this.runningProcess.artifacts;
    modal.methodDecision =
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.runningProcess.process.getPhaseMethodDecision(nodeId)!.decision;
    modal.addFakeExecution.subscribe(async (outputMapping) => {
      await this.runningPhaseProcessContextService.fakeMethodExecution(
        this.runningProcess._id,
        nodeId,
        outputMapping.filter((mapping) => mapping.artifact != null) as {
          artifact: number;
          version: number;
        }[]
      );
      this.modalReference?.close();
    });
    modal.onAllInputsSet();
  }

  async skipExecution(): Promise<void> {
    await this.runningPhaseProcessContextService.skipExecution(
      this.runningProcess._id
    );
  }

  private async checkArtifacts(): Promise<void> {
    const list: MissingArtifacts[] =
      await this.runningPhaseProcessContextService.checkExecution(
        this.runningProcess._id
      );
    this.missingArtifacts = list.map((element) => {
      return {
        name: element.phaseMethodDecision.decision.method.name,
        elementId: element.phaseMethodDecision.id,
        artifacts: element.missingArtifacts,
      };
    });
    this.missingArtifactsNodeIds = new Set<string>(
      list
        .filter((element) => element.missingArtifacts != null)
        .map((element) => element.phaseMethodDecision.id)
    );
  }
}
