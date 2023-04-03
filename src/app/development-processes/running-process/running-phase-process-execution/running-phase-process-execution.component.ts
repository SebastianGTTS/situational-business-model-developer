import {
  Component,
  ElementRef,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { RunningProcessLoaderService } from '../../shared/running-process-loader.service';
import { RunningPhaseProcess } from '../../../development-process-registry/running-process/running-phase-process';
import { RunningPhaseProcessService } from '../../../development-process-registry/running-process/running-phase-process.service';
import { PhaseRunningProcessBoardComponent } from '../phase-running-process-board/phase-running-process-board.component';
import { MethodDecision } from '../../../development-process-registry/bm-process/method-decision';
import { DevelopmentMethodSummaryModalComponent } from '../../development-method/development-method-summary-modal/development-method-summary-modal.component';
import { DevelopmentMethodSummaryModal } from '../../development-method/development-method-summary-modal/development-method-summary-modal';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-running-phase-process-execution',
  templateUrl: './running-phase-process-execution.component.html',
  styleUrls: ['./running-phase-process-execution.component.scss'],
})
export class RunningPhaseProcessExecutionComponent implements OnChanges {
  executedDecisionIds: Set<string> = new Set<string>();

  private modalReference?: NgbModalRef;

  @ViewChild(PhaseRunningProcessBoardComponent)
  phaseRunningProcessBoardComponent?: PhaseRunningProcessBoardComponent;
  @ViewChild('processBoard')
  processBoard?: ElementRef<HTMLDivElement>;

  constructor(
    private modalService: NgbModal,
    private runningPhaseProcessService: RunningPhaseProcessService,
    private runningProcessLoaderService: RunningProcessLoaderService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.runningProcess) {
      this.executedDecisionIds = new Set<string>(
        this.runningProcess?.executedMethods
          .filter((method) => method.nodeId != null)
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          .map((method) => method.nodeId!)
      );
    }
  }

  async startNodeExecution(phaseMethodDecisionId: string): Promise<void> {
    if (this.runningProcess != null) {
      await this.runningPhaseProcessService.startMethodExecution(
        this.runningProcess._id,
        phaseMethodDecisionId
      );
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

  focus(id: string): void {
    this.phaseRunningProcessBoardComponent?.focusElement(id);
    this.processBoard?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  get runningProcess(): RunningPhaseProcess | undefined {
    return this.runningProcessLoaderService.runningPhaseProcess;
  }
}
