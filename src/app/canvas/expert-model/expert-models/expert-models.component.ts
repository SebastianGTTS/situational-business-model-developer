import { Component, ViewChild } from '@angular/core';
import { ExpertModelService } from '../../../canvas-meta-model/expert-model.service';
import {
  ExpertModel,
  ExpertModelInit,
} from '../../../canvas-meta-model/expert-model';
import { Router } from '@angular/router';
import { CanvasDefinition } from '../../../canvas-meta-model/canvas-definition';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ELEMENT_SERVICE, ListService } from '../../../shared/list.service';
import { ModelListComponent } from '../../feature-model/model-list/model-list.component';
import { ModelList } from '../../feature-model/model-list/model-list';

@Component({
  selector: 'app-expert-models',
  templateUrl: './expert-models.component.html',
  styleUrls: ['./expert-models.component.css'],
  providers: [
    ListService,
    { provide: ELEMENT_SERVICE, useExisting: ExpertModelService },
  ],
})
export class ExpertModelsComponent {
  modalExpertModel: ExpertModel;
  private modalReference: NgbModalRef;

  @ViewChild(ModelListComponent) modelList: ModelList;
  @ViewChild('deleteExpertModelModal', { static: true })
  deleteExpertModelModal: unknown;

  constructor(
    private expertModelService: ExpertModelService,
    private listService: ListService<ExpertModel, ExpertModelInit>,
    private modalService: NgbModal,
    private router: Router
  ) {}

  async addExpertModel(
    definition: CanvasDefinition,
    name: string,
    description: string
  ): Promise<void> {
    const expertModel = await this.expertModelService.createFeatureModel(
      { name, description, $definition: definition },
      definition
    );
    await this.listService.add(expertModel);
    this.modelList.resetAddForm();
  }

  async viewExpertModel(expertModelId: string): Promise<void> {
    await this.router.navigate(['/expertModels', expertModelId]);
  }

  async editExpertModel(expertModelId: string): Promise<void> {
    await this.router.navigate(['/expertModels', expertModelId, 'edit']);
  }

  async openDeleteExpertModelModal(featureModelId: string): Promise<void> {
    this.modalExpertModel = await this.expertModelService.get(featureModelId);
    this.modalReference = this.modalService.open(this.deleteExpertModelModal, {
      size: 'lg',
    });
  }

  async reload(): Promise<void> {
    await this.listService.load();
  }

  async deleteExpertModel(featureModelId: string): Promise<void> {
    await this.listService.delete(featureModelId);
  }
}
