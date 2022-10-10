import { Component, OnInit, ViewChild } from '@angular/core';
import { ExperimentDefinition } from '../../hypo-mo-map-meta-model/experiment-definition';
import { ExperimentRepoService } from '../../hypo-mo-map-meta-model/experiment-repo.service';
import { FormGroup } from '@angular/forms';
import { Experiment } from '../../hypo-mo-map-meta-model/experiment';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ExperimentDefinitionLoaderService } from '../shared/experiment-definition-loader.service';
import { Author } from '../../../../model/author';

@Component({
  selector: 'app-experiment-definition',
  templateUrl: './experiment-definition.component.html',
  styleUrls: ['./experiment-definition.component.css'],
  providers: [ExperimentDefinitionLoaderService],
})
export class ExperimentDefinitionComponent implements OnInit {
  modalExperiment?: Experiment;
  experimentList?: Experiment[];
  private modalReference?: NgbModalRef;

  @ViewChild('addExperimentModal', { static: true })
  addExperimentModal: unknown;
  @ViewChild('confirmDeleteModal', { static: true })
  confirmDeleteModal: unknown;
  @ViewChild('manageArtifactsModal', { static: true })
  manageArtifactsModal: unknown;
  @ViewChild('updateExperimentModal', { static: true })
  updateExperimentModal: unknown;

  constructor(
    private experimentDefinitionLoaderService: ExperimentDefinitionLoaderService,
    private experimentRepoService: ExperimentRepoService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.experimentDefinitionLoaderService.loaded.subscribe(() => {
      if (this.experimentDefinition == null) {
        this.experimentList = undefined;
      } else {
        this.experimentList =
          this.experimentDefinition.experiment.getExperimentList();
      }
    });
  }

  async updateAuthor(authorInfo: Partial<Author>): Promise<void> {
    if (this.experimentDefinition != null) {
      await this.experimentRepoService.updateExperimentDefinitionAuthor(
        this.experimentDefinition._id,
        authorInfo
      );
    }
  }

  openAddExperimentModal(id: string): void {
    if (this.experimentDefinition != null) {
      // experiment only used to initialize form
      this.modalExperiment = new Experiment(
        undefined,
        {
          name: '',
          id: '',
        },
        this.experimentDefinition.experiment.getExperiment(id)
      );
      this.modalReference = this.modalService.open(this.addExperimentModal, {
        size: 'lg',
      });
    }
  }

  async addExperiment(experiment: FormGroup): Promise<void> {
    if (this.experimentDefinition != null) {
      await this.experimentRepoService.addExperiment(
        this.experimentDefinition._id,
        experiment.value,
        experiment.get('subexperimentOf')?.value
      );
      this.modalReference?.close();
    }
  }

  openUpdateExperimentModal(id: string): void {
    if (this.experimentDefinition != null) {
      this.modalExperiment =
        this.experimentDefinition.experiment.getExperiment(id);
      this.modalReference = this.modalService.open(this.updateExperimentModal, {
        size: 'lg',
      });
    }
  }

  async updateExperiment(experiment: FormGroup): Promise<void> {
    if (this.experimentDefinition != null && this.modalExperiment != null) {
      await this.experimentRepoService.updateExperiment(
        this.experimentDefinition._id,
        this.modalExperiment.id,
        experiment.get('subexperimentOf') != null
          ? experiment.get('subexperimentOf')?.value
          : this.modalExperiment.parent != null
          ? this.modalExperiment.parent.id
          : undefined,
        experiment.value
      );
      this.modalReference?.close();
    }
  }

  openDeleteExperimentModal(id: string): void {
    if (this.experimentDefinition != null) {
      this.modalExperiment =
        this.experimentDefinition.experiment.getExperiment(id);
      this.modalReference = this.modalService.open(this.confirmDeleteModal, {
        size: 'lg',
      });
    }
  }

  async removeExperiment(id: string): Promise<void> {
    if (this.experimentDefinition != null) {
      await this.experimentRepoService.removeExperiment(
        this.experimentDefinition._id,
        id
      );
      this.modalReference?.close();
    }
  }

  openManageArtifactsModal(id: string): void {
    if (this.experimentDefinition != null) {
      this.modalExperiment =
        this.experimentDefinition.experiment.getExperiment(id);
      this.modalReference = this.modalService.open(this.manageArtifactsModal, {
        size: 'lg',
      });
    }
  }

  get experimentDefinition(): ExperimentDefinition | undefined {
    return this.experimentDefinitionLoaderService.experimentDefinition;
  }
}
