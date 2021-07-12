import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RunningProcess } from '../../development-process-registry/running-process/running-process';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { RunningProcessService } from '../../development-process-registry/running-process/running-process.service';
import { RunningProcessViewerComponent } from '../../development-process-view/running-process-viewer/running-process-viewer.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RunningArtifact } from '../../development-process-registry/running-process/running-artifact';
import { ArtifactVersion } from '../../development-process-registry/running-process/artifact-version';
import { OutputArtifactMappingFormService } from '../shared/output-artifact-mapping-form.service';
import { Decision, GroupSelection } from '../../development-process-registry/bm-process/decision';
import { DevelopmentMethod } from '../../development-process-registry/development-method/development-method';
import { DevelopmentMethodService } from '../../development-process-registry/development-method/development-method.service';
import { SituationalFactor } from '../../development-process-registry/method-elements/situational-factor/situational-factor';
import { BmProcessService } from '../../development-process-registry/bm-process/bm-process.service';
import { Stakeholder } from '../../development-process-registry/method-elements/stakeholder/stakeholder';
import { Artifact } from '../../development-process-registry/method-elements/artifact/artifact';
import { ExecutionErrors } from '../../development-process-registry/running-process/process-execution.service';
import { ArtifactDataReference, ArtifactDataType } from '../../development-process-registry/running-process/artifact-data';
import { RunningMethodInfo } from '../../development-process-registry/running-process/running-method-info';
import { MetaModelService } from '../../development-process-registry/meta-model.service';

@Component({
  selector: 'app-running-process',
  templateUrl: './running-process.component.html',
  styleUrls: ['./running-process.component.css']
})
export class RunningProcessComponent implements OnInit, OnDestroy {

  runningProcess: RunningProcess;
  decisions: any[];

  private routeSubscription: Subscription;

  private modalReference: NgbModalRef;
  modalDecision: Decision;
  modalArtifact: RunningArtifact;
  modalArtifactVersion: ArtifactVersion;
  modalDevelopmentMethods: DevelopmentMethod[] = null;
  modalDevelopmentMethod: DevelopmentMethod;
  modalRunningMethodInfo: RunningMethodInfo;

  @ViewChild(RunningProcessViewerComponent, {static: false}) runningProcessViewer: RunningProcessViewerComponent;
  @ViewChild('infoModal', {static: true}) infoModal: any;
  @ViewChild('multipleOptionsInfoModal', {static: true}) multipleOptionsInfoModal: any;
  @ViewChild('showArtifactVersionModal', {static: true}) showArtifactVersionModal: any;
  @ViewChild('selectMethodModal', {static: true}) selectMethodModal: any;
  @ViewChild('methodConfigurationModal', {static: true}) methodConfigurationModal: any;
  @ViewChild('commentsModal', {static: true}) commentsModal: any;

  constructor(
    private bmProcessService: BmProcessService,
    private developmentMethodService: DevelopmentMethodService,
    private metaModelService: MetaModelService,
    private modalService: NgbModal,
    private outputArtifactMappingFormService: OutputArtifactMappingFormService,
    private route: ActivatedRoute,
    private router: Router,
    private runningProcessService: RunningProcessService,
  ) {
  }

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe(map => this.loadRunningProcess(map.get('id')));
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  openShowArtifactVersionModal(artifact: RunningArtifact, version: ArtifactVersion) {
    this.modalArtifact = artifact;
    this.modalArtifactVersion = version;
    this.modalReference = this.modalService.open(this.showArtifactVersionModal, {size: 'lg'});
  }

  viewArtifactReference(reference: ArtifactDataReference) {
    this.modalReference.close();
    this.metaModelService.getMetaModelApi(reference.type).view(reference, this.router, this.runningProcess._id);
  }

  openInfoModal(decision: Decision) {
    this.modalDecision = decision;
    this.modalReference = this.modalService.open(this.infoModal, {size: 'lg'});
  }

  async openSelectMethodModal() {
    this.modalReference = this.modalService.open(this.selectMethodModal, {
      size: 'lg', beforeDismiss: () => {
        this.modalDevelopmentMethods = null;
        return true;
      }
    });
    this.modalDevelopmentMethods = this.sortByDistance((await this.developmentMethodService.getDevelopmentMethodList()).docs);
  }

  async configureMethod(method: DevelopmentMethod) {
    this.modalDevelopmentMethods = null;
    this.modalReference.close();
    await this.modalReference.result;
    this.modalDevelopmentMethod = new DevelopmentMethod(method);
    this.modalDecision = new Decision({
      method: this.modalDevelopmentMethod,
      stakeholders: new GroupSelection<Stakeholder>({}, null),
      inputArtifacts: new GroupSelection<Artifact>({}, null),
      outputArtifacts: new GroupSelection<Artifact>({}, null),
      tools: null,
      stepDecisions: this.modalDevelopmentMethod.executionSteps.map(() => null),
    });
    this.modalReference = this.modalService.open(this.methodConfigurationModal, {size: 'lg'});
  }

  updateDecision(updates: any) {
    this.modalDecision.update(updates);
  }

  async executeStep(nodeId: string) {
    const selectedFlow = this.runningProcessViewer.getSelectedFlow();
    try {
      await this.runningProcessService.executeStep(this.runningProcess, nodeId, selectedFlow ? selectedFlow.id : null);
      const process = await this.runningProcessService.getRunningProcess(this.runningProcess._id);
      await this.runningProcessService.jumpSteps(process);
      await this.loadRunningProcess(process._id);
    } catch (error) {
      if (error.message === ExecutionErrors.MULTIPLE_OPTIONS) {
        this.focus(nodeId);
        this.modalReference = this.modalService.open(this.multipleOptionsInfoModal, {size: 'lg'});
      } else {
        console.log(error);
      }
    }
  }

  async addMethod() {
    this.modalReference.close();
    await this.runningProcessService.addMethod(this.runningProcess, this.modalDecision);
    await this.loadRunningProcess(this.runningProcess._id);
  }

  async removeMethod(executionId: string) {
    await this.runningProcessService.removeMethod(this.runningProcess, executionId);
    await this.loadRunningProcess(this.runningProcess._id);
  }

  sortByDistance<T extends { _id: string, situationalFactors: { list: string, element: SituationalFactor }[] }[]>(elements: T): T {
    const distanceMap: { [id: string]: number } = {};
    elements.forEach((element) =>
      distanceMap[element._id] = this.bmProcessService.distanceToContext(
        this.runningProcess.process,
        element.situationalFactors.map((factor) => factor.element)
      )
    );
    return elements.sort((elementA, elementB) => distanceMap[elementA._id] - distanceMap[elementB._id]);
  }

  viewExecution(executionId) {
    this.router.navigate(['runningprocess', 'runningprocessview', this.runningProcess._id, 'method', executionId]).then();
  }

  focus(id: string) {
    this.runningProcessViewer.focus(id);
  }

  async startNodeExecution(nodeId: string) {
    await this.runningProcessService.startMethodExecution(this.runningProcess, nodeId);
    await this.loadRunningProcess(this.runningProcess._id);
  }

  async startExecution(executionId: string) {
    await this.runningProcessService.startTodoMethodExecution(this.runningProcess, executionId);
    await this.loadRunningProcess(this.runningProcess._id);
  }

  openCommentsModal(executionId: string) {
    this.modalRunningMethodInfo = this.runningProcess.getMethod(executionId);
    this.modalReference = this.modalService.open(this.commentsModal, {size: 'lg'});
  }

  getArtifactDataTypeString(): ArtifactDataType {
    return ArtifactDataType.STRING;
  }

  getArtifactDataTypeReference(): ArtifactDataType {
    return ArtifactDataType.REFERENCE;
  }

  private async loadRunningProcess(id: string) {
    this.runningProcess = await this.runningProcessService.getRunningProcess(id);
    this.decisions = await this.runningProcessService.getExecutableDecisionNodes(this.runningProcess);
  }
}
