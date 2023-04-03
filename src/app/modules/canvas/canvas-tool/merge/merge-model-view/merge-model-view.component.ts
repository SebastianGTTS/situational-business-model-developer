import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FeatureModel } from '../../../canvas-meta-artifact/feature-model';
import { Feature } from '../../../canvas-meta-artifact/feature';
import { RelationshipType } from '../../../canvas-meta-artifact/relationships';
import { MergeService } from '../merge.service';
import { MergeLoaderService } from '../merge-loader.service';
import { CompanyModel } from '../../../canvas-meta-artifact/company-model';
import { ExpertModel } from '../../../canvas-meta-artifact/expert-model';

@Component({
  selector: 'app-merge-model-view',
  templateUrl: './merge-model-view.component.html',
  styleUrls: ['./merge-model-view.component.css'],
  providers: [MergeLoaderService],
})
export class MergeModelViewComponent implements OnInit {
  @ViewChild('dependencyModal', { static: true }) dependencyModal: unknown;
  @ViewChild('mergeModal', { static: true }) mergeModal: unknown;
  @ViewChild('addAllModal', { static: true }) addAllModal: unknown;
  @ViewChild('updateModal', { static: true }) updateModal: unknown;
  @ViewChild('traceModal', { static: true }) traceModal: unknown;
  @ViewChild('selectModal', { static: true }) selectModal: unknown;
  @ViewChild('deleteModal', { static: true }) deleteModal: unknown;

  companyFeatureList: { id: string; levelname: string }[] = [];

  modalFeatureModel?: FeatureModel;
  modalFeature?: Feature;
  modalTracedFeature?: Feature;
  private modalReference?: NgbModalRef;
  modalSubfeatureIds?: string[];
  modalSelectFeatureForm?: UntypedFormGroup;

  isFullyMerged = false;

  constructor(
    private fb: UntypedFormBuilder,
    private mergeLoaderService: MergeLoaderService,
    private mergeService: MergeService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.mergeLoaderService.loaded.subscribe(() => {
      this.isFullyMerged = this.checkIsFullyMerged();
      this.companyFeatureList = this.companyModel?.getFeatureList() ?? [];
      if (this.modalFeature != null) {
        this.modalFeature = this.companyModel?.getFeature(this.modalFeature.id);
      }
    });
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
  }

  async mergeFeature(featureForm: UntypedFormGroup): Promise<void> {
    if (
      this.companyModel != null &&
      this.expertModel != null &&
      this.modalFeature != null
    ) {
      await this.mergeService.addFeatureMerge(
        this.companyModel._id,
        featureForm.value,
        featureForm.get('subfeatureOf')?.value,
        this.expertModel._id,
        this.modalFeature.id
      );
      await this.closeModal();
    }
  }

  async addAll(featureId?: string): Promise<void> {
    if (this.companyModel != null && this.expertModel != null) {
      await this.mergeService.addAllSubfeaturesMerge(
        this.companyModel._id,
        this.expertModel._id,
        featureId
      );
      await this.closeModal();
    }
  }

  async mergeIntoSelected(): Promise<void> {
    if (
      this.companyModel != null &&
      this.expertModel != null &&
      this.modalFeature != null
    ) {
      await this.mergeService.addTrace(
        this.companyModel._id,
        this.modalSelectFeatureForm?.value.feature,
        this.expertModel._id,
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
      this.companyModel != null &&
      this.expertModel != null &&
      this.modalFeature != null
    ) {
      await this.mergeService.deleteTrace(
        this.companyModel._id,
        this.modalFeature.id,
        this.expertModel._id
      );
      await this.closeModal();
    }
  }

  async deleteExpertTrace(): Promise<void> {
    if (
      this.companyModel != null &&
      this.expertModel != null &&
      this.modalTracedFeature != null
    ) {
      await this.mergeService.deleteTrace(
        this.companyModel._id,
        this.modalTracedFeature.id,
        this.expertModel._id
      );
      await this.closeModal();
    }
  }

  async deleteFeature(featureId: string): Promise<void> {
    if (this.companyModel != null) {
      await this.mergeService.deleteFeature(this.companyModel._id, featureId);
      await this.closeModal();
    }
  }

  async addDependency(
    relationshipType: RelationshipType,
    fromFeatureId: string,
    toFeatureId: string
  ): Promise<void> {
    if (this.companyModel != null) {
      await this.mergeService.addRelationship(
        this.companyModel._id,
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
    if (this.companyModel != null && this.modalFeature != null) {
      await this.mergeService.removeRelationship(
        this.companyModel._id,
        relationshipType,
        fromId,
        toId
      );
    }
  }

  async updateFeature(featureForm: UntypedFormGroup): Promise<void> {
    if (this.companyModel != null && this.modalFeature != null) {
      await this.mergeService.updateFeature(
        this.companyModel._id,
        this.modalFeature.id,
        featureForm.value,
        this.modalFeature.parent != null
          ? featureForm.get('subfeatureOf')?.value
          : undefined
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

  get companyModel(): CompanyModel | undefined {
    return this.mergeLoaderService.companyModel;
  }

  get expertModel(): ExpertModel | undefined {
    return this.mergeLoaderService.expertModel;
  }
}
