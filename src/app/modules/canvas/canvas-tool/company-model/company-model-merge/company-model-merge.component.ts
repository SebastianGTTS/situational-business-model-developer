import { Component } from '@angular/core';
import { CompanyModelLoaderService } from '../company-model-loader.service';
import { CompanyModel } from '../../../canvas-meta-artifact/company-model';

@Component({
  selector: 'app-company-model-merge',
  templateUrl: './company-model-merge.component.html',
  styleUrls: ['./company-model-merge.component.scss'],
})
export class CompanyModelMergeComponent {
  constructor(private companyModelLoaderService: CompanyModelLoaderService) {}

  get companyModel(): CompanyModel | undefined {
    return this.companyModelLoaderService.companyModel;
  }
}
