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
import { BmProcessService } from '../../../../../development-process-registry/bm-process/bm-process.service';
import { BmProcess } from '../../../../../development-process-registry/bm-process/bm-process';
import { RunningProcess } from '../../../../../development-process-registry/running-process/running-process';
import { RunningProcessService } from '../../../../../development-process-registry/running-process/running-process.service';

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

  expertModel?: ExpertModel;
  companyModel?: CompanyModel;

  extraNav = false;
  bmProcess?: BmProcess;
  runningProcess?: RunningProcess;

  companyFeatureList: { id: string; levelname: string }[] = [];

  companyModelId?: string;
  expertModelId?: string;

  private querySubscription?: Subscription;
  private paramSubscription?: Subscription;

  modalFeatureModel?: FeatureModel;
  modalFeature?: Feature;
  modalTracedFeature?: Feature;
  private modalReference?: NgbModalRef;
  modalSubfeatureIds?: string[];
  modalSelectFeatureForm?: FormGroup;

  companyOpenPanels?: string[];

  isFullyMerged = false;

  constructor(
    private bmProcessService: BmProcessService,
    private fb: FormBuilder,
    private mergeService: MergeService,
    private modalService: NgbModal,
    private companyModelService: CompanyModelService,
    private expertModelService: ExpertModelService,
    private route: ActivatedRoute,
    private runningProcessService: RunningProcessService
  ) {}

  ngOnInit(): void {
    this.querySubscription = this.route.queryParamMap.subscribe((paramMap) => {
      const bmProcessId = paramMap.get('bmProcessId');
      if (bmProcessId != null) {
        this.extraNav = true;
        void this.loadBmProcess(bmProcessId);
      } else {
        this.bmProcess = undefined;
      }
      const runningProcessId = paramMap.get('runningProcessId');
      if (runningProcessId != null) {
        this.extraNav = true;
        void this.loadRunningProcess(runningProcessId);
      } else {
        this.runningProcess = undefined;
      }
      if (bmProcessId == null && runningProcessId == null) {
        this.extraNav = false;
      }
    });
    this.paramSubscription = this.route.paramMap.subscribe((params) => {
      this.companyModelId = params.get('companyModelId') ?? undefined;
      this.expertModelId = params.get('expertModelId') ?? undefined;
      void this.loadModels();
    });
  }

  ngOnDestroy(): void {
    if (this.querySubscription != null) {
      this.querySubscription.unsubscribe();
    }
    if (this.paramSubscription != null) {
      this.paramSubscription.unsubscribe();
    }
  }

  async loadBmProcess(bmProcessId: string): Promise<void> {
    this.bmProcess = await this.bmProcessService.get(bmProcessId);
  }

  async loadRunningProcess(runningProcessId: string): Promise<void> {
    this.runningProcess = await this.runningProcessService.get(
      runningProcessId
    );
  }

  async loadModels(): Promise<void> {
    await Promise.all([this.loadExpertModel(), this.loadCompanyModel()]);
    this.isFullyMerged = this.checkIsFullyMerged();
  }

  async loadExpertModel(): Promise<void> {
    if (this.expertModelId != null) {
      this.expertModel = await this.expertModelService.get(this.expertModelId);
    }
  }

  async loadCompanyModel(): Promise<void> {
    if (this.companyModelId != null) {
      const companyModel = await this.companyModelService.get(
        this.companyModelId
      );
      if (this.companyOpenPanels == null) {
        this.companyOpenPanels = Object.values(companyModel.features).reduce(
          (acc: string[], feature) => {
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
  }

  openDependenciesModalExpertModel(featureId: string): void {
    if (this.expertModel != null) {
      this.openDependenciesModal(this.expertModel, featureId);
    }
  }

  openDependenciesModalCompanyModel(featureId: string): void {
    if (this.companyModel != null) {
      this.openDependenciesModal(this.companyModel, featureId);
    }
  }

  openDependenciesModal(featureModel: FeatureModel, featureId: string): void {
    const feature = featureModel.getFeature(featureId);
    this.modalFeatureModel = featureModel;
    this.modalFeature = feature;
    this.modalReference = this.modalService.open(this.dependencyModal, {
      size: 'lg',
    });
  }

  openTraceModal(featureId: string): void {
    if (this.companyModel != null && this.expertModel != null) {
      this.modalFeatureModel = this.companyModel;
      this.modalFeature = this.companyModel.getFeature(featureId);
      this.modalTracedFeature = this.expertModel.getFeature(
        this.modalFeature.expertModelTrace[this.expertModel._id]
      );
      this.modalReference = this.modalService.open(this.traceModal, {
        size: 'lg',
      });
    }
  }

  openExpertTraceModal(featureId: string): void {
    if (this.companyModel != null && this.expertModel != null) {
      this.modalFeatureModel = this.expertModel;
      this.modalFeature = this.expertModel.getFeature(featureId);
      this.modalTracedFeature = this.companyModel.getFeature(
        this.companyModel.expertModelTraces[this.expertModel._id]
          .expertFeatureIdMap[featureId]
      );
      this.modalReference = this.modalService.open(this.traceModal, {
        size: 'lg',
      });
    }
  }

  openMergeModal(featureId: string): void {
    if (this.companyModel != null && this.expertModel != null) {
      const expertFeature = this.expertModel.getFeature(featureId);
      if (expertFeature.parent == null) {
        return;
      }
      const parentId =
        this.companyModel.expertModelTraces[this.expertModel._id]
          .expertFeatureIdMap[expertFeature.parent.id];
      this.modalSubfeatureIds = this.companyModel
        .getFeature(parentId)
        .getAllSubfeatures()
        .map((feature) => feature.id);
      this.modalSubfeatureIds.push(parentId);
      const companyModelFeatureParentId =
        this.companyModel.expertModelTraces[this.expertModel._id]
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
  }

  openAddAllModal(featureId?: string): void {
    this.modalFeature = featureId
      ? this.expertModel?.getFeature(featureId)
      : undefined;
    this.modalReference = this.modalService.open(this.addAllModal, {
      size: 'lg',
    });
  }

  openSelectModal(featureId: string): void {
    if (this.expertModel != null && this.companyModel != null) {
      this.modalFeature = this.expertModel.getFeature(featureId);
      if (this.modalFeature.parent == null) {
        return;
      }
      this.modalSubfeatureIds = this.companyModel
        .getFeature(
          this.companyModel.expertModelTraces[this.expertModel._id]
            .expertFeatureIdMap[this.modalFeature.parent.id]
        )
        .getAllSubfeatures()
        .map((feature) => feature.id);
      const selectedIds = Object.values(
        this.companyModel.expertModelTraces[this.expertModel._id]
          .expertFeatureIdMap
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
  }

  openDeleteFeatureModal(featureId: string): void {
    this.modalFeature = this.companyModel?.getFeature(featureId);
    this.modalReference = this.modalService.open(this.deleteModal, {
      size: 'lg',
    });
  }

  openUpdateFeatureModal(featureId: string): void {
    if (this.companyModel != null) {
      const feature = this.companyModel.getFeature(featureId);
      this.modalFeature = feature;
      this.modalSubfeatureIds = feature.getAllSubfeatures().map((f) => f.id);
      this.modalSubfeatureIds.push(feature.id);
      this.modalReference = this.modalService.open(this.updateModal, {
        size: 'lg',
      });
    }
  }

  /**
   * Closes the current modal.
   */
  async closeModal(): Promise<void> {
    this.modalReference?.close();
    this.modalFeature = undefined;
    await this.loadModels();
  }

  async mergeFeature(featureForm: FormGroup): Promise<void> {
    if (
      this.companyModelId != null &&
      this.expertModelId != null &&
      this.modalFeature != null
    ) {
      await this.mergeService.addFeatureMerge(
        this.companyModelId,
        featureForm.value,
        featureForm.get('subfeatureOf')?.value,
        this.expertModelId,
        this.modalFeature.id
      );
      await this.closeModal();
    }
  }

  async addAll(featureId?: string): Promise<void> {
    if (this.companyModelId != null && this.expertModelId != null) {
      await this.mergeService.addAllSubfeaturesMerge(
        this.companyModelId,
        this.expertModelId,
        featureId
      );
      await this.closeModal();
    }
  }

  async mergeIntoSelected(): Promise<void> {
    if (
      this.companyModelId != null &&
      this.expertModelId != null &&
      this.modalFeature != null
    ) {
      await this.mergeService.addTrace(
        this.companyModelId,
        this.modalSelectFeatureForm?.value.feature,
        this.expertModelId,
        this.modalFeature.id
      );
      await this.closeModal();
    }
  }

  async deleteTrace(): Promise<void> {
    if (this.modalFeatureModel === this.companyModel) {
      await this.deleteCompanyTrace();
    } else {
      await this.deleteExpertTrace();
    }
  }

  async deleteCompanyTrace(): Promise<void> {
    if (
      this.companyModelId != null &&
      this.expertModelId != null &&
      this.modalFeature != null
    ) {
      await this.mergeService.deleteTrace(
        this.companyModelId,
        this.modalFeature.id,
        this.expertModelId
      );
      await this.closeModal();
    }
  }

  async deleteExpertTrace(): Promise<void> {
    if (
      this.companyModelId != null &&
      this.expertModelId != null &&
      this.modalTracedFeature != null
    ) {
      await this.mergeService.deleteTrace(
        this.companyModelId,
        this.modalTracedFeature.id,
        this.expertModelId
      );
      await this.closeModal();
    }
  }

  async deleteFeature(featureId: string): Promise<void> {
    if (this.companyModelId != null) {
      await this.mergeService.deleteFeature(this.companyModelId, featureId);
      await this.closeModal();
    }
  }

  async addDependency(
    relationshipType: RelationshipType,
    fromFeatureId: string,
    toFeatureId: string
  ): Promise<void> {
    if (this.companyModelId != null) {
      await this.mergeService.addRelationship(
        this.companyModelId,
        relationshipType,
        fromFeatureId,
        toFeatureId
      );
      await this.closeModal();
    }
  }

  async deleteDependency(
    relationshipType: RelationshipType,
    fromId: string,
    toId: string
  ): Promise<void> {
    if (
      this.companyModelId != null &&
      this.companyModel != null &&
      this.modalFeature != null
    ) {
      await this.mergeService.removeRelationship(
        this.companyModelId,
        relationshipType,
        fromId,
        toId
      );
      await this.loadModels();
      this.modalFeature = this.companyModel.getFeature(this.modalFeature.id);
    }
  }

  async updateFeature(featureForm: FormGroup): Promise<void> {
    if (this.companyModelId != null && this.modalFeature != null) {
      await this.mergeService.updateFeature(
        this.companyModelId,
        this.modalFeature.id,
        featureForm.value,
        featureForm.get('subfeatureOf')?.value
      );
      await this.closeModal();
    }
  }

  asKeys(map: { [id: string]: Feature }): string[] {
    return Object.keys(map);
  }

  private checkIsFullyMerged(): boolean {
    if (this.expertModel == null || this.companyModel == null) {
      return false;
    }
    return this.expertModel
      .getFeatureList()
      .every(
        (feature) =>
          this.expertModel != null &&
          !!this.companyModel?.expertModelTraces[this.expertModel._id]
            .expertFeatureIdMap[feature.id]
      );
  }
}
