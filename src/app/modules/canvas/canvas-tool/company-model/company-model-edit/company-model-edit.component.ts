import { Component } from '@angular/core';
import { CompanyModelService } from '../../../canvas-meta-artifact/company-model.service';
import { CompanyModelLoaderService } from '../company-model-loader.service';
import { CompanyModel } from '../../../canvas-meta-artifact/company-model';

@Component({
  selector: 'app-company-model-edit',
  templateUrl: './company-model-edit.component.html',
  styleUrls: ['./company-model-edit.component.css'],
})
export class CompanyModelEditComponent {
  constructor(
    private companyModelLoaderService: CompanyModelLoaderService,
    private companyModelService: CompanyModelService
  ) {}

  async updateCompanyModel(): Promise<void> {
    if (this.companyModel != null) {
      await this.companyModelService.save(this.companyModel);
    }
  }

  get companyModel(): CompanyModel | undefined {
    return this.companyModelLoaderService.companyModel;
  }
}
