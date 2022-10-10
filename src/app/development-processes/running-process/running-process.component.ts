import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RunningProcessService } from '../../development-process-registry/running-process/running-process.service';
import { RunningProcessViewerComponent } from '../../development-process-view/running-process-viewer/running-process-viewer.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RunningArtifact } from '../../development-process-registry/running-process/running-artifact';
import { OutputArtifactMappingFormService } from '../shared/output-artifact-mapping-form.service';
import {
  DevelopmentMethod,
  DevelopmentMethodEntry,
} from '../../development-process-registry/development-method/development-method';
import { DevelopmentMethodService } from '../../development-process-registry/development-method/development-method.service';
import { BmProcessService } from '../../development-process-registry/bm-process/bm-process.service';
import { ExecutionErrors } from '../../development-process-registry/running-process/process-execution.service';
import { RunningMethodInfo } from '../../development-process-registry/running-process/running-method-info';
import { MetaModelService } from '../../development-process-registry/meta-model.service';
import { RunningProcessLoaderService } from '../shared/running-process-loader.service';
import {
  FullRunningProcess,
  RunningProcess,
} from '../../development-process-registry/running-process/running-process';
import { ConcreteArtifactService } from '../../development-process-registry/running-process/concrete-artifact.service';
import { DevelopmentMethodIncompleteModalComponent } from '../development-method-incomplete-modal/development-method-incomplete-modal.component';
import {
  MethodDecision,
  MethodDecisionUpdate,
} from '../../development-process-registry/bm-process/method-decision';
import { BpmnFlowNode } from 'bpmn-js';
import { OutputArtifactMapping } from '../../development-process-registry/running-process/output-artifact-mapping';
import { Artifact } from '../../development-process-registry/method-elements/artifact/artifact';
import { ArtifactVersion } from '../../development-process-registry/running-process/artifact-version';
import { Domain } from '../../development-process-registry/knowledge/domain';
import {
  SituationalFactor,
  SituationalFactorInit,
} from '../../development-process-registry/method-elements/situational-factor/situational-factor';
import {
  Selection,
  SelectionInit,
} from '../../development-process-registry/development-method/selection';
import { RunningMethod } from '../../development-process-registry/running-process/running-method';
import { RunningProcessContextChangeModalComponent } from '../running-process-context-change-modal/running-process-context-change-modal.component';
import { RunningProcessContextChangeModal } from '../running-process-context-change-modal/running-process-context-change-modal';

@Component({
  selector: 'app-running-process',
  templateUrl: './running-process.component.html',
  styleUrls: ['./running-process.component.css'],
  providers: [RunningProcessLoaderService],
})
export class RunningProcessComponent implements OnInit {
  decisions: BpmnFlowNode[] = []; // node decisions

  private modalReference?: NgbModalRef;
  modalDecision?: MethodDecision;
  modalToDoMethod?: RunningMethod;
  modalDevelopmentMethods?: DevelopmentMethodEntry[];
  modalRunningMethodInfo?: RunningMethodInfo;
  modalRunningMethodInfoArtifacts?: {
    artifact: RunningArtifact;
    versions: ArtifactVersion[];
  }[];

  @ViewChild(RunningProcessViewerComponent)
  runningProcessViewer!: RunningProcessViewerComponent;
  @ViewChild('infoModal', { static: true }) infoModal: unknown;
  @ViewChild('multipleOptionsInfoModal', { static: true })
  multipleOptionsInfoModal: unknown;
  @ViewChild('notCompletelyDefinedModal', { static: true })
  notCompletelyDefinedModal: unknown;
  @ViewChild('selectMethodModal', { static: true }) selectMethodModal: unknown;
  @ViewChild('methodConfigurationModal', { static: true })
  methodConfigurationModal: unknown;
  @ViewChild('methodArtifactsModal', { static: true })
  methodArtifactsModal: unknown;
  @ViewChild('commentsModal', { static: true }) commentsModal: unknown;

  constructor(
    private bmProcessService: BmProcessService,
    private concreteArtifactService: ConcreteArtifactService,
    private developmentMethodService: DevelopmentMethodService,
    private metaModelService: MetaModelService,
    private modalService: NgbModal,
    private outputArtifactMappingFormService: OutputArtifactMappingFormService,
    private route: ActivatedRoute,
    private router: Router,
    public runningProcessLoaderService: RunningProcessLoaderService,
    private runningProcessService: RunningProcessService
  ) {}

  ngOnInit(): void {
    this.runningProcessLoaderService.loaded.subscribe(() =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.afterReload(this.runningProcess!)
    );
  }

  async viewArtifactVersion(version: ArtifactVersion): Promise<void> {
    if (this.runningProcess != null) {
      await this.runningProcessService.viewInternalArtifact(
        this.runningProcess._id,
        version.id
      );
    }
  }

  async editArtifact(artifact: RunningArtifact): Promise<void> {
    if (this.runningProcess != null) {
      await this.runningProcessService.editInternalArtifact(
        this.runningProcess,
        artifact
      );
    }
  }

  openInfoModal(decision: MethodDecision): void {
    this.modalDecision = decision;
    this.modalReference = this.modalService.open(this.infoModal, {
      size: 'lg',
    });
  }

  async openSelectMethodModal(): Promise<void> {
    if (this.runningProcess != null) {
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
  }

  async addToDoMethod(method: DevelopmentMethodEntry): Promise<void> {
    if (this.runningProcess != null) {
      const developmentMethod = new DevelopmentMethod(method, undefined);
      if (
        !this.developmentMethodService.isCorrectlyDefined(developmentMethod)
      ) {
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
  }

  editToDoMethod(executionId: string): void {
    this.modalToDoMethod = this.runningProcess?.getTodoMethod(executionId);
    this.modalReference = this.modalService.open(
      this.methodConfigurationModal,
      { size: 'lg' }
    );
  }

  async updateDecision(updates: MethodDecisionUpdate): Promise<void> {
    if (this.runningProcess != null && this.modalToDoMethod != null) {
      await this.runningProcessService.updateMethodDecision(
        this.runningProcess._id,
        this.modalToDoMethod.executionId,
        updates
      );
    }
  }

  async executeStep(nodeId: string): Promise<void> {
    if (this.runningProcess != null && this.runningProcess.hasProcess()) {
      const selectedFlow = this.runningProcessViewer.getSelectedFlow();
      try {
        await this.runningProcessService.executeStep(
          this.runningProcess,
          nodeId,
          selectedFlow ? selectedFlow.id : undefined
        );
        const process = (await this.runningProcessService.get(
          this.runningProcess._id
        )) as FullRunningProcess;
        await this.runningProcessService.jumpSteps(process);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.message === ExecutionErrors.MULTIPLE_OPTIONS) {
          this.focus(nodeId);
          this.modalReference = this.modalService.open(
            this.multipleOptionsInfoModal,
            { size: 'lg' }
          );
        } else {
          console.log(error);
        }
      }
    }
  }

  async removeMethod(executionId: string): Promise<void> {
    if (this.runningProcess != null) {
      await this.runningProcessService.removeMethod(
        this.runningProcess,
        executionId
      );
    }
  }

  async viewExecution(executionId: string): Promise<void> {
    if (this.runningProcess != null) {
      await this.router.navigate([
        'runningprocess',
        'runningprocessview',
        this.runningProcess._id,
        'method',
        executionId,
      ]);
    }
  }

  viewArtifacts(executionId: string): void {
    this.modalRunningMethodInfo =
      this.runningProcess?.getExecutedMethod(executionId);
    this.modalRunningMethodInfoArtifacts =
      this.runningProcess?.getArtifactsOfExecutedMethod(executionId);
    this.modalReference = this.modalService.open(this.methodArtifactsModal, {
      size: 'lg',
    });
  }

  focus(id: string): void {
    this.runningProcessViewer.focus(id);
  }

  async startNodeExecution(nodeId: string): Promise<void> {
    if (this.runningProcess != null) {
      await this.runningProcessService.startMethodExecution(
        this.runningProcess._id,
        nodeId
      );
    }
  }

  async startExecution(executionId: string): Promise<void> {
    if (this.runningProcess != null) {
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
  }

  openCommentsModal(executionId: string): void {
    if (this.runningProcess != null) {
      this.modalRunningMethodInfo = this.runningProcess.getMethod(executionId);
      this.modalReference = this.modalService.open(this.commentsModal, {
        size: 'lg',
      });
    }
  }

  async exportArtifact(
    identifier: string,
    artifact: RunningArtifact
  ): Promise<void> {
    if (this.runningProcess != null) {
      artifact = await this.concreteArtifactService.export(
        identifier,
        artifact,
        this.runningProcess.name
      );
      await this.router.navigate([
        '/',
        'concreteArtifacts',
        'detail',
        artifact._id,
      ]);
    }
  }

  async importArtifact(artifactId: string): Promise<void> {
    if (this.runningProcess != null) {
      const artifact = await this.concreteArtifactService.get(artifactId);
      const copiedArtifact = await this.concreteArtifactService.copy(artifact);
      await this.runningProcessService.importArtifact(
        this.runningProcess._id,
        copiedArtifact
      );
    }
  }

  async renameArtifact(
    identifier: string,
    artifact: RunningArtifact
  ): Promise<void> {
    if (this.runningProcess != null) {
      await this.runningProcessService.renameArtifact(
        this.runningProcess,
        artifact,
        identifier
      );
    }
  }

  async removeArtifact(artifact: RunningArtifact): Promise<void> {
    if (this.runningProcess != null) {
      await this.runningProcessService.removeArtifact(
        this.runningProcess._id,
        artifact._id
      );
    }
  }

  async addArtifact(
    artifact: Artifact,
    output: OutputArtifactMapping
  ): Promise<void> {
    if (this.runningProcess != null) {
      await this.runningProcessService.addArtifact(
        this.runningProcess._id,
        artifact,
        output
      );
    }
  }

  createArtifact(artifact: Artifact): void {
    if (this.runningProcess != null) {
      this.runningProcessService.createInternalArtifact(
        this.runningProcess._id,
        artifact
      );
    }
  }

  async openRequestContextChangeModal(): Promise<void> {
    if (this.runningProcess != null) {
      const modalReference = this.modalService.open(
        RunningProcessContextChangeModalComponent,
        {
          size: 'lg',
        }
      );
      this.modalReference = modalReference;
      const modal: RunningProcessContextChangeModal =
        modalReference.componentInstance;
      modal.domains = this.runningProcess.domains;
      modal.situationalFactors = this.runningProcess.situationalFactors;
      modal.requestContextChange.subscribe((request) => {
        void this.requestContextChange(
          request.comment,
          request.domains,
          request.situationalFactors
        );
        modalReference.close();
      });
    }
  }

  /**
   * Requests a context change from the method engineer
   *
   * @param comment
   * @param domains
   * @param situationalFactors
   */
  async requestContextChange(
    comment: string,
    domains: Domain[],
    situationalFactors: Selection<SituationalFactor>[]
  ): Promise<void> {
    if (this.runningProcess != null && this.runningProcess.hasProcess()) {
      await this.runningProcessService.setContextChange(
        this.runningProcess._id,
        comment,
        domains,
        situationalFactors
      );
      await this.router.navigate(['/', 'runningprocess']);
    }
  }

  async updateDomains(domains: Domain[]): Promise<void> {
    if (this.runningProcess != null) {
      await this.runningProcessService.updateDomains(
        this.runningProcess._id,
        domains
      );
    }
  }

  async updateSituationalFactors(
    situationalFactors: SelectionInit<SituationalFactorInit>[]
  ): Promise<void> {
    if (this.runningProcess != null) {
      await this.runningProcessService.updateSituationalFactors(
        this.runningProcess._id,
        situationalFactors
      );
    }
  }

  private async afterReload(runningProcess: RunningProcess): Promise<void> {
    this.decisions =
      await this.runningProcessService.getExecutableDecisionNodes(
        runningProcess
      );
    if (this.modalToDoMethod != null) {
      this.modalToDoMethod = runningProcess.getTodoMethod(
        this.modalToDoMethod.executionId
      );
    }
  }

  get runningProcess(): RunningProcess | undefined {
    return this.runningProcessLoaderService.runningProcess;
  }
}
