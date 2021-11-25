import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RunningProcessService } from '../../development-process-registry/running-process/running-process.service';
import { RunningProcessViewerComponent } from '../../development-process-view/running-process-viewer/running-process-viewer.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RunningArtifact } from '../../development-process-registry/running-process/running-artifact';
import { ArtifactVersion } from '../../development-process-registry/running-process/artifact-version';
import { OutputArtifactMappingFormService } from '../shared/output-artifact-mapping-form.service';
import {
  Decision,
  GroupSelection,
} from '../../development-process-registry/bm-process/decision';
import { DevelopmentMethod } from '../../development-process-registry/development-method/development-method';
import { DevelopmentMethodService } from '../../development-process-registry/development-method/development-method.service';
import { SituationalFactor } from '../../development-process-registry/method-elements/situational-factor/situational-factor';
import { BmProcessService } from '../../development-process-registry/bm-process/bm-process.service';
import { Stakeholder } from '../../development-process-registry/method-elements/stakeholder/stakeholder';
import { Artifact } from '../../development-process-registry/method-elements/artifact/artifact';
import { ExecutionErrors } from '../../development-process-registry/running-process/process-execution.service';
import {
  ArtifactDataReference,
  ArtifactDataType,
} from '../../development-process-registry/running-process/artifact-data';
import { RunningMethodInfo } from '../../development-process-registry/running-process/running-method-info';
import { MetaModelService } from '../../development-process-registry/meta-model.service';
import { RunningProcessLoaderService } from '../shared/running-process-loader.service';
import { RunningProcess } from '../../development-process-registry/running-process/running-process';
import { ConcreteArtifactService } from '../../development-process-registry/running-process/concrete-artifact.service';
import { DevelopmentMethodIncompleteModalComponent } from '../development-method-incomplete-modal/development-method-incomplete-modal.component';

@Component({
  selector: 'app-running-process',
  templateUrl: './running-process.component.html',
  styleUrls: ['./running-process.component.css'],
  providers: [RunningProcessLoaderService],
})
export class RunningProcessComponent implements OnInit {
  decisions: any[];

  private modalReference: NgbModalRef;
  modalDecision: Decision;
  modalArtifact: RunningArtifact;
  modalArtifactVersion: ArtifactVersion;
  modalDevelopmentMethods: DevelopmentMethod[] = null;
  modalDevelopmentMethod: DevelopmentMethod;
  modalRunningMethodInfo: RunningMethodInfo;

  @ViewChild(RunningProcessViewerComponent)
  runningProcessViewer: RunningProcessViewerComponent;
  @ViewChild('infoModal', { static: true }) infoModal: unknown;
  @ViewChild('multipleOptionsInfoModal', { static: true })
  multipleOptionsInfoModal: unknown;
  @ViewChild('showArtifactVersionModal', { static: true })
  showArtifactVersionModal: unknown;
  @ViewChild('selectMethodModal', { static: true }) selectMethodModal: unknown;
  @ViewChild('methodConfigurationModal', { static: true })
  methodConfigurationModal: unknown;
  @ViewChild('commentsModal', { static: true }) commentsModal: unknown;
  @ViewChild('artifactExportModal', { static: true })
  artifactExportModal: unknown;
  @ViewChild('artifactImportModal', { static: true })
  artifactImportModal: unknown;
  @ViewChild('artifactRenameModal', { static: true })
  artifactRenameModal: unknown;

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
      this.afterReload(this.runningProcess)
    );
  }

  openShowArtifactVersionModal(
    artifact: RunningArtifact,
    version: ArtifactVersion
  ): void {
    this.modalArtifact = artifact;
    this.modalArtifactVersion = version;
    this.modalReference = this.modalService.open(
      this.showArtifactVersionModal,
      { size: 'lg' }
    );
  }

  viewArtifactReference(reference: ArtifactDataReference): void {
    this.modalReference.close();
    this.metaModelService
      .getMetaModelApi(reference.type)
      .view(reference, this.router, {
        referenceType: 'Process',
        runningProcessId: this.runningProcess._id,
      });
  }

  openInfoModal(decision: Decision): void {
    this.modalDecision = decision;
    this.modalReference = this.modalService.open(this.infoModal, {
      size: 'lg',
    });
  }

  async openSelectMethodModal(): Promise<void> {
    this.modalReference = this.modalService.open(this.selectMethodModal, {
      size: 'lg',
      beforeDismiss: () => {
        this.modalDevelopmentMethods = null;
        return true;
      },
    });
    this.modalDevelopmentMethods = this.sortByDistance(
      await this.developmentMethodService.getList()
    );
  }

  async configureMethod(method: DevelopmentMethod): Promise<void> {
    const developmentMethod = new DevelopmentMethod(method);
    if (!this.developmentMethodService.isCorrectlyDefined(developmentMethod)) {
      const modal = this.modalService.open(
        DevelopmentMethodIncompleteModalComponent
      );
      const component: DevelopmentMethodIncompleteModalComponent =
        modal.componentInstance;
      component.developmentMethod = developmentMethod;
      return;
    }
    this.modalDevelopmentMethods = null;
    this.modalReference.close();
    await this.modalReference.result;
    this.modalDevelopmentMethod = developmentMethod;
    this.modalDecision = new Decision({
      method: this.modalDevelopmentMethod,
      stakeholders: new GroupSelection<Stakeholder>({}, null),
      inputArtifacts: new GroupSelection<Artifact>({}, null),
      outputArtifacts: new GroupSelection<Artifact>({}, null),
      tools: null,
      stepDecisions: this.modalDevelopmentMethod.executionSteps.map(() => null),
    });
    this.modalReference = this.modalService.open(
      this.methodConfigurationModal,
      { size: 'lg' }
    );
  }

  updateDecision(updates: any): void {
    this.modalDecision.update(updates);
  }

  async executeStep(nodeId: string): Promise<void> {
    const selectedFlow = this.runningProcessViewer.getSelectedFlow();
    try {
      await this.runningProcessService.executeStep(
        this.runningProcess,
        nodeId,
        selectedFlow ? selectedFlow.id : null
      );
      const process = await this.runningProcessService.get(
        this.runningProcess._id
      );
      await this.runningProcessService.jumpSteps(process);
    } catch (error) {
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

  async addMethod(): Promise<void> {
    this.modalReference.close();
    await this.runningProcessService.addMethod(
      this.runningProcess,
      this.modalDecision
    );
  }

  async removeMethod(executionId: string): Promise<void> {
    await this.runningProcessService.removeMethod(
      this.runningProcess,
      executionId
    );
  }

  sortByDistance<
    T extends {
      _id: string;
      situationalFactors: { list: string; element: SituationalFactor }[];
    }[]
  >(elements: T): T {
    const distanceMap: { [id: string]: number } = {};
    elements.forEach(
      (element) =>
        (distanceMap[element._id] = this.bmProcessService.distanceToContext(
          this.runningProcess.process,
          element.situationalFactors.map((factor) => factor.element)
        ))
    );
    return elements.sort(
      (elementA, elementB) =>
        distanceMap[elementA._id] - distanceMap[elementB._id]
    );
  }

  async viewExecution(executionId): Promise<void> {
    await this.router.navigate([
      'runningprocess',
      'runningprocessview',
      this.runningProcess._id,
      'method',
      executionId,
    ]);
  }

  focus(id: string): void {
    this.runningProcessViewer.focus(id);
  }

  async startNodeExecution(nodeId: string): Promise<void> {
    await this.runningProcessService.startMethodExecution(
      this.runningProcess._id,
      nodeId
    );
  }

  async startExecution(executionId: string): Promise<void> {
    await this.runningProcessService.startTodoMethodExecution(
      this.runningProcess._id,
      executionId
    );
  }

  openCommentsModal(executionId: string): void {
    this.modalRunningMethodInfo = this.runningProcess.getMethod(executionId);
    this.modalReference = this.modalService.open(this.commentsModal, {
      size: 'lg',
    });
  }

  openArtifactExportModal(artifact: RunningArtifact): void {
    this.modalArtifact = artifact;
    this.modalReference = this.modalService.open(this.artifactExportModal, {
      size: 'lg',
    });
  }

  async exportArtifact(
    identifier: string,
    artifact: RunningArtifact
  ): Promise<void> {
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

  openArtifactImportModal(): void {
    this.modalReference = this.modalService.open(this.artifactImportModal, {
      size: 'lg',
    });
  }

  async importArtifact(artifactId: string): Promise<void> {
    const artifact = await this.concreteArtifactService.get(artifactId);
    const copiedArtifact = await this.concreteArtifactService.copy(artifact);
    await this.runningProcessService.importArtifact(
      this.runningProcess._id,
      copiedArtifact
    );
  }

  openRenameArtifactModal(artifact: RunningArtifact): void {
    this.modalArtifact = artifact;
    this.modalReference = this.modalService.open(this.artifactRenameModal, {
      size: 'lg',
    });
  }

  async renameArtifact(
    identifier: string,
    artifact: RunningArtifact
  ): Promise<void> {
    await this.runningProcessService.renameArtifact(
      this.runningProcess,
      artifact,
      identifier
    );
  }

  getArtifactDataTypeString(): ArtifactDataType {
    return ArtifactDataType.STRING;
  }

  getArtifactDataTypeReference(): ArtifactDataType {
    return ArtifactDataType.REFERENCE;
  }

  private async afterReload(runningProcess: RunningProcess): Promise<void> {
    this.decisions =
      await this.runningProcessService.getExecutableDecisionNodes(
        runningProcess
      );
  }

  get runningProcess(): RunningProcess {
    return this.runningProcessLoaderService.runningProcess;
  }
}
