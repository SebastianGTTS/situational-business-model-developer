import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyModel } from '../../../canvas-meta-model/company-model';
import { CompanyModelService } from '../../../canvas-meta-model/company-model.service';
import { CanvasDefinition } from '../../../canvas-meta-model/canvas-definition';

@Component({
  selector: 'app-company-models',
  templateUrl: './company-models.component.html',
  styleUrls: ['./company-models.component.css']
})
export class CompanyModelsComponent implements OnInit {

  companyModelList: CompanyModel[];

  constructor(
    private companyModelService: CompanyModelService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.loadCompanyModelList().then();
  }

  async addCompanyModel(definition: CanvasDefinition, name: string, description: string) {
    await this.companyModelService.createCompanyModel({name, description}, definition);
    this.loadCompanyModelList().then();
  }

  viewCompanyModel(companyModelId: string): void {
    this.router.navigate(['/companyModels', companyModelId]).then();
  }

  editCompanyModel(companyModelId: string): void {
    this.router.navigate(['/companyModels', companyModelId, 'edit']).then();
  }

  async deleteCompanyModel(featureModelId: string) {
    await this.companyModelService.delete(featureModelId);
    this.loadCompanyModelList().then();
  }

  async loadCompanyModelList() {
    const result = await this.companyModelService.getList();
    this.companyModelList = result.docs;
  }

}
