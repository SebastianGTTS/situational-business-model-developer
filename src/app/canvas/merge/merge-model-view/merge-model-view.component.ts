import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExpertModel } from '../../../canvas-meta-model/expert-model';
import { CompanyModel } from '../../../canvas-meta-model/company-model';
import { FeatureModel } from '../../../canvas-meta-model/feature-model';
import { Feature } from '../../../canvas-meta-model/feature';
import { CompanyModelService } from '../../../canvas-meta-model/company-model.service';
import { ExpertModelService } from '../../../canvas-meta-model/expert-model.service';
import { RelationshipType } from '../../../canvas-meta-model/relationships';
import { MergeService } from '../merge.service';
import { BmProcessService } from '../../../development-process-registry/bm-process/bm-process.service';
import { BmProcess } from '../../../development-process-registry/bm-process/bm-process';

@Component({
  selector: 'app-merge-model-view',
  templateUrl: './merge-model-view.component.html',
  styleUrls: ['./merge-model-view.component.css'],
})
export class MergeModelViewComponent implements OnInit, OnDestroy {
  @ViewChild('dependencyModal', { static: true }) dependencyModal: unknown;
  @ViewChild('mergeModal', { static: true }) mergeModal: unknown;
  @ViewChild('addAllModal', { static: true }) addAllModal: unknown;
  @ViewChild('updateModal', { static: true }) updateModal: unknown;
  @ViewChild('traceModal', { static: true }) traceModal: unknown;
  @ViewChild('selectModal', { static: true }) selectModal: unknown;
  @ViewChild('deleteModal', { static: true }) deleteModal: unknown;

  expertModel: ExpertModel;
  companyModel: CompanyModel;

  bmProcessGiven = false;
  bmProcess?: BmProcess;

  companyFeatureList: { id: string; levelname: string }[] = [];

  companyModelId: string;
  expertModelId: string;

  private querySubscription: Subscription;
  private paramSubscription: Subscription;

  modalFeatureModel: FeatureModel;
  modalFeature: Feature;
  modalTracedFeature: Feature;
  modalReference: NgbModalRef;
  modalSubfeatureIds: string[];
  modalSelectFeatureForm: FormGroup;

  companyOpenPanels: string[] = null;

  isFullyMerged = false;

  constructor(
    private bmProcessService: BmProcessService,
    private fb: FormBuilder,
    private mergeService: MergeService,
    private modalService: NgbModal,
    private companyModelService: CompanyModelService,
    private expertModelService: ExpertModelService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.querySubscription = this.route.queryParamMap.subscribe((paramMap) => {
      if (paramMap.has('bmProcessId')) {
        this.bmProcessGiven = true;
        void this.loadBmProcess(paramMap.get('bmProcessId'));
      } else {
        this.bmProcess = undefined;
        this.bmProcessGiven = false;
      }
    });
    this.paramSubscription = this.route.paramMap.subscribe((params) => {
      this.companyModelId = params.get('companyModelId');
      this.expertModelId = params.get('expertModelId');
      void this.loadModels();
    });
  }

  ngOnDestroy(): void {
    if (this.querySubscription !== null) {
      this.querySubscription.unsubscribe();
    }
    if (this.paramSubscription !== null) {
      this.paramSubscription.unsubscribe();
    }
  }

  async loadBmProcess(bmProcessId: string): Promise<void> {
    this.bmProcess = await this.bmProcessService.get(bmProcessId);
  }

  async loadModels(): Promise<void> {
    await Promise.all([this.loadExpertModel(), this.loadCompanyModel()]);
    this.isFullyMerged = this.checkIsFullyMerged();
  }

  async loadExpertModel(): Promise<void> {
    this.expertModel = await this.expertModelService.get(this.expertModelId);
  }

  async loadCompanyModel(): Promise<void> {
    const companyModel = await this.companyModelService.get(
      this.companyModelId
    );
    if (this.companyOpenPanels === null) {
      this.companyOpenPanels = Object.values(companyModel.features).reduce(
        (acc, feature) => {
          acc.push(feature.fixId);
          acc.push(
            ...feature
              .getAllSubfeatures()
              .filter((f) => Object.values(f.subfeatures).length > 0)
              .map((f) => f.fixId)
          );
          return acc;
        },
        []
      );
    }
    this.companyModel = companyModel;
    this.companyFeatureList = companyModel.getFeatureList();
  }

  openDependenciesModalExpertModel(featureId: string): void {
    this.openDependenciesModal(this.expertModel, featureId);
  }

  openDependenciesModalCompanyModel(featureId: string): void {
    this.openDependenciesModal(this.companyModel, featureId);
  }

  openDependenciesModal(featureModel: FeatureModel, featureId: string): void {
    const feature = featureModel.getFeature(featureId);
    this.modalFeatureModel = featureModel;
    this.modalFeature = feature;
    this.modalReference = this.modalService.open(this.dependencyModal, {
      size: 'lg',
    });
  }

  openTraceModal(featureId): void {
    this.modalFeatureModel = this.companyModel;
    this.modalFeature = this.companyModel.getFeature(featureId);
    this.modalTracedFeature = this.expertModel.getFeature(
      this.modalFeature.expertModelTrace[this.expertModelId]
    );
    this.modalReference = this.modalService.open(this.traceModal, {
      size: 'lg',
    });
  }

  openExpertTraceModal(featureId): void {
    this.modalFeatureModel = this.expertModel;
    this.modalFeature = this.expertModel.getFeature(featureId);
    this.modalTracedFeature = this.companyModel.getFeature(
      this.companyModel.expertModelTraces[this.expertModelId]
        .expertFeatureIdMap[featureId]
    );
    this.modalReference = this.modalService.open(this.traceModal, {
      size: 'lg',
    });
  }

  openMergeModal(featureId: string): void {
    const expertFeature = this.expertModel.getFeature(featureId);
    const parentId =
      this.companyModel.expertModelTraces[this.expertModelId]
        .expertFeatureIdMap[expertFeature.parent.id];
    this.modalSubfeatureIds = this.companyModel
      .getFeature(parentId)
      .getAllSubfeatures()
      .map((feature) => feature.id);
    this.modalSubfeatureIds.push(parentId);
    const companyModelFeatureParentId =
      this.companyModel.expertModelTraces[this.expertModelId]
        .expertFeatureIdMap[expertFeature.parent.id];
    this.modalFeature = new Feature(
      undefined,
      expertFeature,
      expertFeature.id,
      new Feature(
        undefined,
        { name: '' },
        companyModelFeatureParentId,
        undefined
      )
    );
    this.modalReference = this.modalService.open(this.mergeModal, {
      size: 'lg',
    });
  }

  openAddAllModal(featureId: string): void {
    this.modalFeature = featureId
      ? this.expertModel.getFeature(featureId)
      : null;
    this.modalReference = this.modalService.open(this.addAllModal, {
      size: 'lg',
    });
  }

  openSelectModal(featureId: string): void {
    this.modalFeature = this.expertModel.getFeature(featureId);
    this.modalSubfeatureIds = this.companyModel
      .getFeature(
        this.companyModel.expertModelTraces[this.expertModelId]
          .expertFeatureIdMap[this.modalFeature.parent.id]
      )
      .getAllSubfeatures()
      .map((feature) => feature.id);
    const selectedIds = Object.values(
      this.companyModel.expertModelTraces[this.expertModelId].expertFeatureIdMap
    );
    this.modalSubfeatureIds = this.modalSubfeatureIds.filter(
      (id) => !selectedIds.includes(id)
    );
    this.modalSelectFeatureForm = this.fb.group({
      feature: null,
    });
    this.modalReference = this.modalService.open(this.selectModal, {
      size: 'lg',
    });
  }

  openDeleteFeatureModal(featureId: string): void {
    this.modalFeature = this.companyModel.getFeature(featureId);
    this.modalReference = this.modalService.open(this.deleteModal, {
      size: 'lg',
    });
  }

  openUpdateFeatureModal(featureId: string): void {
    const feature = this.companyModel.getFeature(featureId);
    this.modalFeature = feature;
    this.modalSubfeatureIds = feature.getAllSubfeatures().map((f) => f.id);
    this.modalSubfeatureIds.push(feature.id);
    this.modalReference = this.modalService.open(this.updateModal, {
      size: 'lg',
    });
  }

  /**
   * Closes the current modal.
   */
  async closeModal(): Promise<void> {
    this.modalReference.close();
    this.modalFeature = null;
    await this.loadModels();
  }

  async mergeFeature(featureForm: FormGroup): Promise<void> {
    await this.mergeService.addFeatureMerge(
      this.companyModelId,
      featureForm.value,
      featureForm.get('subfeatureOf').value,
      this.expertModelId,
      this.modalFeature.id
    );
    await this.closeModal();
  }

  async addAll(featureId: string): Promise<void> {
    await this.mergeService.addAllSubfeaturesMerge(
      this.companyModelId,
      this.expertModelId,
      featureId
    );
    await this.closeModal();
  }

  async mergeIntoSelected(): Promise<void> {
    await this.mergeService.addTrace(
      this.companyModelId,
      this.modalSelectFeatureForm.value.feature,
      this.expertModelId,
      this.modalFeature.id
    );
    await this.closeModal();
  }

  async deleteTrace(): Promise<void> {
    if (this.modalFeatureModel === this.companyModel) {
      await this.deleteCompanyTrace();
    } else {
      await this.deleteExpertTrace();
    }
  }

  async deleteCompanyTrace(): Promise<void> {
    await this.mergeService.deleteTrace(
      this.companyModelId,
      this.modalFeature.id,
      this.expertModelId
    );
    await this.closeModal();
  }

  async deleteExpertTrace(): Promise<void> {
    await this.mergeService.deleteTrace(
      this.companyModelId,
      this.modalTracedFeature.id,
      this.expertModelId
    );
    await this.closeModal();
  }

  async deleteFeature(featureId): Promise<void> {
    await this.mergeService.deleteFeature(this.companyModelId, featureId);
    await this.closeModal();
  }

  async addDependency(
    relationshipType: RelationshipType,
    fromFeatureId: string,
    toFeatureId: string
  ): Promise<void> {
    await this.mergeService.addRelationship(
      this.companyModelId,
      relationshipType,
      fromFeatureId,
      toFeatureId
    );
    await this.closeModal();
  }

  async deleteDependency(
    relationshipType: RelationshipType,
    fromId: string,
    toId: string
  ): Promise<void> {
    await this.mergeService.removeRelationship(
      this.companyModelId,
      relationshipType,
      fromId,
      toId
    );
    await this.loadModels();
    this.modalFeature = this.companyModel.getFeature(this.modalFeature.id);
  }

  async updateFeature(featureForm: FormGroup): Promise<void> {
    await this.mergeService.updateFeature(
      this.companyModelId,
      this.modalFeature.id,
      featureForm.value,
      featureForm.get('subfeatureOf').value
    );
    await this.closeModal();
  }

  asKeys(map: { [id: string]: Feature }): string[] {
    return Object.keys(map);
  }

  private checkIsFullyMerged(): boolean {
    return this.expertModel
      .getFeatureList()
      .every(
        (feature) =>
          !!this.companyModel.expertModelTraces[this.expertModel._id]
            .expertFeatureIdMap[feature.id]
      );
  }
}
