import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  RunningProcess,
  RunningProcessInit,
} from '../../../development-process-registry/running-process/running-process';
import { RunningProcessServiceBase } from '../../../development-process-registry/running-process/running-process.service';
import { RunningMethod } from '../../../development-process-registry/running-process/running-method';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  DevelopmentMethod,
  DevelopmentMethodEntry,
} from '../../../development-process-registry/development-method/development-method';
import { DevelopmentMethodIncompleteModalComponent } from '../../development-method/development-method-incomplete-modal/development-method-incomplete-modal.component';
import {
  MethodDecision,
  MethodDecisionUpdate,
} from '../../../development-process-registry/bm-process/method-decision';
import { DevelopmentMethodService } from '../../../development-process-registry/development-method/development-method.service';
import { RunningMethodInfo } from '../../../development-process-registry/running-process/running-method-info';
import { RunningArtifact } from '../../../development-process-registry/running-process/running-artifact';
import { ArtifactVersion } from '../../../development-process-registry/running-process/artifact-version';
import { DevelopmentMethodSummaryModal } from '../../development-method/development-method-summary-modal/development-method-summary-modal';
import { BmProcessService } from '../../../development-process-registry/bm-process/bm-process.service';
import { Router } from '@angular/router';
import { ConcreteArtifactService } from '../../../development-process-registry/running-process/concrete-artifact.service';
import { DevelopmentMethodSummaryModalComponent } from '../../development-method/development-method-summary-modal/development-method-summary-modal.component';
import { RunningProcessFinishModalComponent } from '../running-process-finish-modal/running-process-finish-modal.component';
import { TutorialManagerService } from '../../../tutorial/tutorial-manager.service';

@Component({
  selector: 'app-running-process-base',
  templateUrl: './running-process-base.component.html',
  styleUrls: ['./running-process-base.component.css'],
})
export class RunningProcessBaseComponent<
  T extends RunningProcess,
  S extends RunningProcessInit
> implements OnChanges
{
  @Input() runningProcess!: T;
  @Output() focusNode = new EventEmitter<string>();
  @Output() startNodeExecution = new EventEmitter<string>();

  private modalReference?: NgbModalRef;
  modalDevelopmentMethods?: DevelopmentMethodEntry[];
  modalRunningMethodInfo?: RunningMethodInfo;
  modalRunningMethodInfoArtifacts?: {
    artifact: RunningArtifact;
    versions: ArtifactVersion[];
  }[];
  modalToDoMethod?: RunningMethod;

  @ViewChild('commentsModal', { static: true }) commentsModal: unknown;
  @ViewChild('methodArtifactsModal', { static: true })
  methodArtifactsModal: unknown;
  @ViewChild('methodConfigurationModal', { static: true })
  methodConfigurationModal: unknown;
  @ViewChild('notCompletelyDefinedModal', { static: true })
  notCompletelyDefinedModal: unknown;
  @ViewChild('selectMethodModal', { static: true }) selectMethodModal: unknown;

  constructor(
    private bmProcessService: BmProcessService,
    private concreteArtifactService: ConcreteArtifactService,
    private developmentMethodService: DevelopmentMethodService,
    private modalService: NgbModal,
    private router: Router,
    private runningProcessService: RunningProcessServiceBase<T, S>,
    private tutorialManagerService: TutorialManagerService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.runningProcess) {
      if (this.modalReference != null) {
        if (this.modalToDoMethod != null) {
          this.modalToDoMethod = this.runningProcess.getTodoMethod(
            this.modalToDoMethod.executionId
          );
        }
        if (this.modalRunningMethodInfo != null) {
          this.modalRunningMethodInfo = this.runningProcess.getMethod(
            this.modalRunningMethodInfo.executionId
          );
          if (
            this.modalRunningMethodInfo != null &&
            this.modalRunningMethodInfoArtifacts != null
          ) {
            this.modalRunningMethodInfoArtifacts =
              this.runningProcess.getArtifactsOfExecutedMethod(
                this.modalRunningMethodInfo.executionId
              );
          }
        }
      }
    }
  }

  /**
   * Open modal to add a new todo_Method
   */
  async openSelectMethodModal(): Promise<void> {
    this.modalReference = this.modalService.open(this.selectMethodModal, {
      size: 'lg',
      beforeDismiss: () => {
        this.modalDevelopmentMethods = undefined;
        return true;
      },
    });
    this.modalDevelopmentMethods =
      await this.developmentMethodService.getSortedList(
        this.runningProcess.situationalFactors.map(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          (selection) => selection.element!
        )
      );
  }

  async addToDoMethod(method: DevelopmentMethodEntry): Promise<void> {
    const developmentMethod = new DevelopmentMethod(method, undefined);
    if (!this.developmentMethodService.isCorrectlyDefined(developmentMethod)) {
      const modal = this.modalService.open(
        DevelopmentMethodIncompleteModalComponent
      );
      const component: DevelopmentMethodIncompleteModalComponent =
        modal.componentInstance;
      component.developmentMethod = developmentMethod;
      return;
    }
    this.modalDevelopmentMethods = undefined;
    this.modalReference?.close();
    await this.modalReference?.result;
    const decision = new MethodDecision(undefined, {
      method: developmentMethod,
    });
    const executionId = await this.runningProcessService.addMethod(
      this.runningProcess._id,
      decision
    );
    const process = await this.runningProcessService.get(
      this.runningProcess._id
    );
    this.modalToDoMethod = process.getTodoMethod(executionId);
    this.modalReference = this.modalService.open(
      this.methodConfigurationModal,
      { size: 'lg' }
    );
  }

  editToDoMethod(executionId: string): void {
    this.modalToDoMethod = this.runningProcess?.getTodoMethod(executionId);
    this.modalReference = this.modalService.open(
      this.methodConfigurationModal,
      { size: 'lg' }
    );
  }

  async updateDecision(updates: MethodDecisionUpdate): Promise<void> {
    if (this.modalToDoMethod != null) {
      await this.runningProcessService.updateMethodDecision(
        this.runningProcess._id,
        this.modalToDoMethod.executionId,
        updates
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

  async removeMethod(executionId: string): Promise<void> {
    await this.runningProcessService.removeMethod(
      this.runningProcess._id,
      executionId
    );
  }

  async startExecution(executionId: string): Promise<void> {
    const toDoMethod = this.runningProcess.getTodoMethod(executionId);
    if (toDoMethod != null) {
      if (
        !toDoMethod.decision.isComplete() ||
        !this.bmProcessService.checkDecisionStepArtifacts(toDoMethod.decision)
      ) {
        this.modalToDoMethod = toDoMethod;
        this.modalReference = this.modalService.open(
          this.notCompletelyDefinedModal,
          {
            size: 'lg',
          }
        );
        return;
      }
      await this.runningProcessService.startTodoMethodExecution(
        this.runningProcess._id,
        executionId
      );
    }
  }

  async viewExecution(executionId: string): Promise<void> {
    await this.router.navigate(
      [
        'runningprocess',
        'runningprocessview',
        this.runningProcess._id,
        'method',
        executionId,
      ],
      {
        queryParams: {
          tutorial: this.tutorialManagerService.isRunning(),
        },
      }
    );
  }

  openCommentsModal(executionId: string): void {
    this.modalRunningMethodInfo = this.runningProcess.getMethod(executionId);
    this.modalReference = this.modalService.open(this.commentsModal, {
      size: 'lg',
    });
  }

  async editArtifact(artifact: RunningArtifact): Promise<void> {
    await this.runningProcessService.editInternalArtifact(
      this.runningProcess._id,
      artifact._id
    );
  }

  async viewArtifactVersion(version: ArtifactVersion): Promise<void> {
    await this.runningProcessService.viewInternalArtifact(
      this.runningProcess._id,
      version.id
    );
  }

  viewArtifacts(executionId: string): void {
    this.modalRunningMethodInfo =
      this.runningProcess.getExecutedMethod(executionId);
    this.modalRunningMethodInfoArtifacts =
      this.runningProcess.getArtifactsOfExecutedMethod(executionId);
    this.modalReference = this.modalService.open(this.methodArtifactsModal, {
      size: 'lg',
    });
  }

  finish(): void {
    this.modalReference = this.modalService.open(
      RunningProcessFinishModalComponent,
      {
        size: 'lg',
      }
    );
    const component: RunningProcessFinishModalComponent =
      this.modalReference.componentInstance;
    component.runningProcess = this.runningProcess;
    this.modalReference.closed.subscribe(async (conclusion: string) => {
      await this.runningProcessService.finishRunningProcess(
        this.runningProcess._id,
        conclusion
      );
    });
  }
}
