import { Constructor, MixinOnLoaded } from '../../../../shared/utils';
import { HypoMoMap } from '../../hypo-mo-map-meta-model/hypo-mo-map';
import { ExperimentRepoService } from '../../hypo-mo-map-meta-model/experiment-repo.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ExperimentAddModalComponent } from '../experiment-add-modal/experiment-add-modal.component';
import { ExperimentAddModal } from '../experiment-add-modal/experiment-add-modal';
import { HypoMoMapTree } from '../../hypo-mo-map-meta-model/hypo-mo-map-tree';
import { HypoMoMapTreeService } from '../../hypo-mo-map-meta-model/hypo-mo-map-tree.service';
import {
  ExperimentDefinition,
  ExperimentDefinitionEntry,
} from '../../hypo-mo-map-meta-model/experiment-definition';
import { ExperimentDeleteModalComponent } from '../experiment-delete-modal/experiment-delete-modal.component';
import { ExperimentDeleteModal } from '../experiment-delete-modal/experiment-delete-modal';
import { ExperimentUsed } from '../../hypo-mo-map-meta-model/experiment-used';
import { ExperimentEvidenceCostsModalComponent } from '../experiment-evidence-costs-modal/experiment-evidence-costs-modal.component';
import { ExperimentEvidenceCostsModal } from '../experiment-evidence-costs-modal/experiment-evidence-costs-modal';
import { FormGroup } from '@angular/forms';
import { MappingAddModalComponent } from '../mapping-add-modal/mapping-add-modal.component';
import { MappingAddModal } from '../mapping-add-modal/mapping-add-modal';
import { Hypothesis } from '../../hypo-mo-map-meta-model/hypothesis';
import { HypothesisMappingsModalComponent } from '../hypothesis-mappings-modal/hypothesis-mappings-modal.component';
import { HypothesisMappingsModal } from '../hypothesis-mappings-modal/hypothesis-mappings-modal';
import { ExperimentMappingsModalComponent } from '../experiment-mappings-modal/experiment-mappings-modal.component';
import { ExperimentMappingsModal } from '../experiment-mappings-modal/experiment-mappings-modal';
import { ArtifactsShowModalComponent } from '../artifacts-show-modal/artifacts-show-modal.component';
import { ArtifactsShowModal } from '../artifacts-show-modal/artifacts-show-modal';

export interface ExperimentsEditMixin {
  openAddExperimentModal(): Promise<void>;

  addExperiment(experimentDefinition: ExperimentDefinitionEntry): Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function ExperimentsEditMixin<T extends Constructor<MixinOnLoaded>>(
  Base: T
) {
  abstract class ExperimentsEditor
    extends Base
    implements ExperimentsEditMixin
  {
    protected abstract get experimentRepoService(): ExperimentRepoService;

    protected abstract get hypoMoMapTreeService(): HypoMoMapTreeService;

    protected abstract get hypoMoMap(): HypoMoMap | undefined;

    protected abstract get hypoMoMapTree(): HypoMoMapTree | undefined;

    protected abstract get hypothesisList(): Hypothesis[] | undefined;

    protected abstract get modalService(): NgbModal;

    modalReference?: NgbModalRef;

    async openAddExperimentModal(): Promise<void> {
      if (this.hypoMoMap != null) {
        const experiments = await this.experimentRepoService.getExperimentsList(
          Object.keys(this.hypoMoMap.usedExperiments)
        );
        this.modalReference = this.modalService.open(
          ExperimentAddModalComponent,
          {
            size: 'lg',
          }
        );
        const modal: ExperimentAddModal = this.modalReference.componentInstance;
        modal.experiments = experiments;
        modal.addExperiment.subscribe((experimentDefinition) => {
          void this.addExperiment(experimentDefinition);
        });
      }
    }

    async addExperiment(
      experimentDefinition: ExperimentDefinitionEntry
    ): Promise<void> {
      if (this.hypoMoMapTree != null && this.hypoMoMap != null) {
        await this.hypoMoMapTreeService.addExperimentDefinition(
          this.hypoMoMapTree._id,
          this.hypoMoMap.id,
          new ExperimentDefinition(experimentDefinition, undefined)
        );
        this.modalReference?.close();
      }
    }

    openRemoveExperimentModal(experimentId: string): void {
      if (this.hypoMoMap != null) {
        this.modalReference = this.modalService.open(
          ExperimentDeleteModalComponent,
          { size: 'lg' }
        );
        const modal: ExperimentDeleteModal =
          this.modalReference.componentInstance;
        modal.experiment = this.hypoMoMap.usedExperiments[experimentId];
        modal.removeExperiment.subscribe((deleteId) => {
          void this.removeExperiment(deleteId);
        });
      }
    }

    async removeExperiment(experimentId: string): Promise<void> {
      if (this.hypoMoMapTree != null && this.hypoMoMap != null) {
        await this.hypoMoMapTreeService.removeExperimentDefinition(
          this.hypoMoMapTree._id,
          this.hypoMoMap.id,
          experimentId
        );
        this.modalReference?.close();
      }
    }

    openEvidenceCostsModal(
      experimentDefinitionId: string,
      experimentId: string
    ): void {
      if (this.hypoMoMap != null) {
        const rootExperiment =
          this.hypoMoMap.usedExperiments[experimentDefinitionId];
        const experiment = rootExperiment.getExperiment(
          experimentId
        ) as ExperimentUsed;
        this.modalReference = this.modalService.open(
          ExperimentEvidenceCostsModalComponent,
          {
            size: 'lg',
          }
        );
        const modal: ExperimentEvidenceCostsModal =
          this.modalReference.componentInstance;
        modal.experiment = experiment;
        modal.setEvidenceCosts.subscribe((value) => {
          void this.setEvidenceCosts(
            value.experimentDefinitionId,
            value.experimentId,
            value.experiment
          );
        });
      }
    }

    async setEvidenceCosts(
      experimentDefinitionId: string,
      experimentId: string,
      experiment: FormGroup
    ): Promise<void> {
      if (this.hypoMoMapTree != null && this.hypoMoMap != null) {
        await this.hypoMoMapTreeService.updateExperiment(
          this.hypoMoMapTree._id,
          this.hypoMoMap.id,
          experimentDefinitionId,
          experimentId,
          experiment.value
        );
        this.modalReference?.close();
      }
    }

    openAddHypothesisToExperimentModal(
      experimentDefinitionId: string,
      experimentId: string
    ): void {
      this.modalReference = this.modalService.open(MappingAddModalComponent, {
        size: 'lg',
      });
      const modal: MappingAddModal = this.modalReference.componentInstance;
      modal.hypoMoMap = this.hypoMoMap;
      modal.hypothesisList = this.hypothesisList;
      modal.mapping = {
        experimentDefinitionId: experimentDefinitionId,
        experimentId: experimentId,
      };
      modal.addMapping.subscribe((mappingFormGroup) => {
        void this.addMapping(mappingFormGroup);
      });
    }

    openAddExperimentToHypothesisModal(hypothesisId: string): void {
      this.modalReference = this.modalService.open(MappingAddModalComponent, {
        size: 'lg',
      });
      const modal: MappingAddModal = this.modalReference.componentInstance;
      modal.hypoMoMap = this.hypoMoMap;
      modal.hypothesisList = this.hypothesisList;
      modal.mapping = {
        hypothesisId: hypothesisId,
      };
      modal.addMapping.subscribe((mappingFormGroup) => {
        void this.addMapping(mappingFormGroup);
      });
    }

    async addMapping(mapping: FormGroup): Promise<void> {
      if (this.hypoMoMapTree != null && this.hypoMoMap != null) {
        try {
          await this.hypoMoMapTreeService.addMapping(
            this.hypoMoMapTree._id,
            this.hypoMoMap.id,
            mapping.value
          );
          this.modalReference?.close();
        } catch (error) {
          if ((error as Error).message === 'Mapping already defined') {
            mapping.setErrors({ alreadyDefined: true });
          } else {
            throw error;
          }
        }
      }
    }

    openShowMappingsHypothesisModal(hypothesisId: string): void {
      if (this.hypoMoMap != null) {
        const hypoMoMap = this.hypoMoMap;
        this.modalReference = this.modalService.open(
          HypothesisMappingsModalComponent,
          {
            size: 'lg',
          }
        );
        const modal: HypothesisMappingsModal =
          this.modalReference.componentInstance;
        modal.hypothesis = hypoMoMap.getHypothesis(hypothesisId);
        modal.mappings = hypoMoMap.mappings
          .filter((mapping) => mapping.hypothesisId === hypothesisId)
          .map((mapping) => {
            return {
              experiment: hypoMoMap.usedExperiments[
                mapping.experimentDefinitionId
              ].getExperiment(mapping.experimentId) as ExperimentUsed,
              metric: mapping.metric,
            };
          });
        modal.removeMapping.subscribe((event) => {
          void this.removeMapping(
            event.experimentDefinitionId,
            event.experimentId,
            event.hypothesisId
          );
        });
      }
    }

    openShowMappingsExperimentModal(
      experimentDefinitionId: string,
      experimentId: string
    ): void {
      if (this.hypoMoMap != null) {
        const hypoMoMap = this.hypoMoMap;
        const rootExperiment =
          this.hypoMoMap.usedExperiments[experimentDefinitionId];
        const experiment = rootExperiment.getExperiment(
          experimentId
        ) as ExperimentUsed;
        this.modalReference = this.modalService.open(
          ExperimentMappingsModalComponent,
          {
            size: 'lg',
          }
        );
        const modal: ExperimentMappingsModal =
          this.modalReference.componentInstance;
        modal.experiment = experiment;
        modal.mappings = hypoMoMap.mappings
          .filter(
            (mapping) =>
              mapping.experimentDefinitionId === experimentDefinitionId &&
              mapping.experimentId === experimentId
          )
          .map((mapping) => {
            return {
              hypothesis: hypoMoMap.getHypothesis(mapping.hypothesisId),
              metric: mapping.metric,
            };
          });
        modal.removeMapping.subscribe((event) => {
          void this.removeMapping(
            event.experimentDefinitionId,
            event.experimentId,
            event.hypothesisId
          );
        });
      }
    }

    async removeMapping(
      experimentDefinitionId: string,
      experimentId: string,
      hypothesisId: string
    ): Promise<void> {
      if (this.hypoMoMapTree != null && this.hypoMoMap != null) {
        await this.hypoMoMapTreeService.removeMapping(
          this.hypoMoMapTree._id,
          this.hypoMoMap.id,
          experimentDefinitionId,
          experimentId,
          hypothesisId
        );
        this.modalReference?.close();
      }
    }

    openShowArtifactsModal(
      experimentDefinitionId: string,
      experimentId: string
    ): void {
      if (this.hypoMoMap != null) {
        const rootExperiment =
          this.hypoMoMap.usedExperiments[experimentDefinitionId];
        const experiment = rootExperiment.getExperiment(
          experimentId
        ) as ExperimentUsed;
        this.modalReference = this.modalService.open(
          ArtifactsShowModalComponent,
          {
            size: 'lg',
          }
        );
        const modal: ArtifactsShowModal = this.modalReference.componentInstance;
        modal.experiment = experiment;
      }
    }

    onLoaded(): void {
      super.onLoaded?.();
      const reference = this.modalReference;
      if (reference != null && reference.componentInstance != null) {
        if (
          reference.componentInstance instanceof ExperimentAddModalComponent
        ) {
          void this.updateExperimentAddModal(reference);
        } else if (
          reference.componentInstance instanceof ExperimentDeleteModalComponent
        ) {
          this.updateExperimentDeleteModal(reference);
        } else if (
          reference.componentInstance instanceof
          ExperimentEvidenceCostsModalComponent
        ) {
          this.updateExperimentEvidenceCostsModal(reference);
        } else if (
          reference.componentInstance instanceof MappingAddModalComponent
        ) {
          this.updateMappingAddModalComponent(reference);
        } else if (
          reference.componentInstance instanceof
          HypothesisMappingsModalComponent
        ) {
          this.updateHypothesisMappingsModal(reference);
        } else if (
          reference.componentInstance instanceof
          ExperimentMappingsModalComponent
        ) {
          this.updateExperimentMappingsModal(reference);
        } else if (
          reference.componentInstance instanceof ArtifactsShowModalComponent
        ) {
          this.updateArtifactsShowModal(reference);
        }
      }
    }

    private async updateExperimentAddModal(
      reference: NgbModalRef
    ): Promise<void> {
      if (this.hypoMoMap != null) {
        const modal: ExperimentAddModal = reference.componentInstance;
        modal.experiments = await this.experimentRepoService.getExperimentsList(
          Object.keys(this.hypoMoMap.usedExperiments)
        );
      }
    }

    private updateExperimentDeleteModal(reference: NgbModalRef): void {
      const modal: ExperimentDeleteModal = reference.componentInstance;
      if (this.hypoMoMap != null && modal.experiment != null) {
        modal.experiment = this.hypoMoMap.usedExperiments[modal.experiment.id];
        if (modal.experiment == null) {
          reference.dismiss();
        }
      }
    }

    private updateExperimentEvidenceCostsModal(reference: NgbModalRef): void {
      const modal: ExperimentEvidenceCostsModal = reference.componentInstance;
      const experiment = this.getExperiment(modal.experiment);
      if (experiment == null) {
        reference.dismiss();
      } else {
        modal.experiment = experiment;
      }
    }

    private updateMappingAddModalComponent(reference: NgbModalRef): void {
      const modal: MappingAddModal = reference.componentInstance;
      modal.hypoMoMap = this.hypoMoMap;
      modal.hypothesisList = this.hypothesisList;
    }

    private updateHypothesisMappingsModal(reference: NgbModalRef): void {
      if (this.hypoMoMap != null) {
        const hypoMoMap = this.hypoMoMap;
        const modal: HypothesisMappingsModal = reference.componentInstance;
        const hypothesis = this.getHypothesis(modal.hypothesis);
        if (hypothesis == null) {
          reference.dismiss();
        } else {
          const hypothesisId = hypothesis.id;
          modal.hypothesis = hypothesis;
          modal.mappings = hypoMoMap.mappings
            .filter((mapping) => mapping.hypothesisId === hypothesisId)
            .map((mapping) => {
              return {
                experiment: hypoMoMap.usedExperiments[
                  mapping.experimentDefinitionId
                ].getExperiment(mapping.experimentId) as ExperimentUsed,
                metric: mapping.metric,
              };
            });
        }
      }
    }

    private updateExperimentMappingsModal(reference: NgbModalRef): void {
      if (this.hypoMoMap != null) {
        const hypoMoMap = this.hypoMoMap;
        const modal: ExperimentMappingsModal = reference.componentInstance;
        const experiment = this.getExperiment(modal.experiment);
        if (experiment == null) {
          reference.dismiss();
        } else {
          const experimentDefinitionId = experiment.getExperimentDefinitionId();
          const experimentId = experiment.id;
          modal.experiment = experiment;
          modal.mappings = hypoMoMap.mappings
            .filter(
              (mapping) =>
                mapping.experimentDefinitionId === experimentDefinitionId &&
                mapping.experimentId === experimentId
            )
            .map((mapping) => {
              return {
                hypothesis: hypoMoMap.getHypothesis(mapping.hypothesisId),
                metric: mapping.metric,
              };
            });
        }
      }
    }

    private updateArtifactsShowModal(reference: NgbModalRef): void {
      const modal: ArtifactsShowModal = reference.componentInstance;
      const experiment = this.getExperiment(modal.experiment);
      if (experiment == null) {
        reference.dismiss();
      } else {
        modal.experiment = experiment;
      }
    }

    private getHypothesis(
      modalHypothesis: Hypothesis | undefined
    ): Hypothesis | undefined {
      if (this.hypoMoMap != null && modalHypothesis != null) {
        const hypothesisId = modalHypothesis.id;
        try {
          return this.hypoMoMap.getHypothesis(hypothesisId);
        } catch (error) {
          if (
            error instanceof Error &&
            error.message ===
              'Hypothesis with id ' + hypothesisId + ' does not exist'
          ) {
            return undefined;
          }
        }
      }
      return undefined;
    }

    private getExperiment(
      modalExperiment: ExperimentUsed | undefined
    ): ExperimentUsed | undefined {
      if (this.hypoMoMap != null && modalExperiment != null) {
        const experimentDefinitionId =
          modalExperiment.getExperimentDefinitionId();
        const experimentId = modalExperiment.id;
        const rootExperiment =
          this.hypoMoMap.usedExperiments[experimentDefinitionId];
        try {
          const experiment = rootExperiment?.getExperiment(experimentId);
          if (experiment != null) {
            return experiment as ExperimentUsed;
          }
        } catch (error) {
          if (
            error instanceof Error &&
            error.message ===
              'Experiment with id ' + experimentId + ' does not exist'
          ) {
            return undefined;
          } else {
            throw error;
          }
        }
      }
      return undefined;
    }
  }

  return ExperimentsEditor;
}
