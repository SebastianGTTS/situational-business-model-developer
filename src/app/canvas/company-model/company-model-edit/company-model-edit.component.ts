import { Component } from '@angular/core';
import { CompanyModelService } from '../../../canvas-meta-model/company-model.service';
import { CompanyModelLoaderService } from '../company-model-loader.service';

@Component({
  selector: 'app-company-model-edit',
  templateUrl: './company-model-edit.component.html',
  styleUrls: ['./company-model-edit.component.css'],
  providers: [CompanyModelLoaderService],
})
export class CompanyModelEditComponent {
  constructor(
    private companyModelLoaderService: CompanyModelLoaderService,
    private companyModelService: CompanyModelService
  ) {}

  async updateCompanyModel() {
    await this.companyModelService.save(this.companyModel);
  }

  get companyModel() {
    return this.companyModelLoaderService.companyModel;
  }
}
