import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  CompanyModel,
  CompanyModelInit,
} from '../../../canvas-meta-model/company-model';
import { CompanyModelService } from '../../../canvas-meta-model/company-model.service';
import { CanvasDefinition } from '../../../canvas-meta-model/canvas-definition';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ELEMENT_SERVICE, ListService } from '../../../shared/list.service';
import { ModelListComponent } from '../../feature-model/model-list/model-list.component';
import { ModelList } from '../../feature-model/model-list/model-list';
import { DbId } from '../../../database/database-entry';

@Component({
  selector: 'app-company-models',
  templateUrl: './company-models.component.html',
  styleUrls: ['./company-models.component.css'],
  providers: [
    ListService,
    { provide: ELEMENT_SERVICE, useExisting: CompanyModelService },
  ],
})
export class CompanyModelsComponent {
  modalCompanyModel: CompanyModel;
  private modalReference: NgbModalRef;

  @ViewChild(ModelListComponent) modelList: ModelList;
  @ViewChild('deleteCompanyModelModal', { static: true })
  deleteCompanyModelModal: unknown;

  constructor(
    private companyModelService: CompanyModelService,
    private listService: ListService<CompanyModel, CompanyModelInit>,
    private modalService: NgbModal,
    private router: Router
  ) {}

  async addCompanyModel(
    definition: CanvasDefinition,
    name: string,
    description: string
  ): Promise<void> {
    await this.listService.add(
      this.companyModelService.createFeatureModel(
        { name, description, $definition: definition },
        definition
      )
    );
    this.modelList.resetAddForm();
  }

  async viewCompanyModel(companyModelId: DbId): Promise<void> {
    await this.router.navigate(['/companyModels', companyModelId]);
  }

  async editCompanyModel(companyModelId: DbId): Promise<void> {
    await this.router.navigate(['/companyModels', companyModelId, 'edit']);
  }

  async openDeleteCompanyModelModal(featureModelId: DbId): Promise<void> {
    this.modalCompanyModel = await this.companyModelService.get(featureModelId);
    this.modalReference = this.modalService.open(this.deleteCompanyModelModal, {
      size: 'lg',
    });
  }

  async deleteCompanyModel(featureModelId: DbId): Promise<void> {
    await this.listService.delete(featureModelId);
  }
}
