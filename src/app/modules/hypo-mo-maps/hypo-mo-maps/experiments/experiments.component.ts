import { Component, ViewChild } from '@angular/core';
import {
  ExperimentDefinition,
  ExperimentDefinitionEntry,
  ExperimentDefinitionInit,
} from '../../hypo-mo-map-meta-model/experiment-definition';
import { ExperimentRepoService } from '../../hypo-mo-map-meta-model/experiment-repo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ELEMENT_SERVICE, ListService } from '../../../../shared/list.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-experiments',
  templateUrl: './experiments.component.html',
  styleUrls: ['./experiments.component.css'],
  providers: [
    ListService,
    { provide: ELEMENT_SERVICE, useExisting: ExperimentRepoService },
  ],
})
/**
 * Shows experiments defined in the experiment repository
 */
export class ExperimentsComponent {
  experimentForm = this.fb.group({
    name: this.fb.control('', Validators.required),
  });

  modalExperiment?: ExperimentDefinitionEntry;
  private modalReference?: NgbModalRef;

  @ViewChild('deleteExperimentModal', { static: true })
  deleteExperimentModal: unknown;

  constructor(
    private experimentRepoService: ExperimentRepoService,
    private fb: FormBuilder,
    private listService: ListService<
      ExperimentDefinition,
      ExperimentDefinitionInit
    >,
    private modalService: NgbModal
  ) {}

  openDeleteExperimentModal(experiment: ExperimentDefinitionEntry): void {
    this.modalExperiment = experiment;
    this.modalReference = this.modalService.open(this.deleteExperimentModal, {
      size: 'lg',
    });
  }

  async deleteExperiment(id: string): Promise<void> {
    await this.listService.delete(id);
  }

  async addExperiment(experimentForm: FormGroup): Promise<void> {
    await this.listService.add(
      this.experimentRepoService.getExperimentDefinitionInit(
        experimentForm.value.name
      )
    );
    this.experimentForm.reset();
  }

  get experimentsList(): ExperimentDefinitionEntry[] | undefined {
    return this.listService.elements;
  }

  get noResults(): boolean {
    return this.listService.noResults;
  }

  get loading(): boolean {
    return this.listService.loading;
  }

  get reloading(): boolean {
    return this.listService.reloading;
  }
}
