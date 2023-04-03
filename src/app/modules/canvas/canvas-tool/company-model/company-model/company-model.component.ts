import { Component } from '@angular/core';
import { CompanyModelLoaderService } from '../company-model-loader.service';
import { CompanyModel } from '../../../canvas-meta-artifact/company-model';

@Component({
  selector: 'app-company-model',
  templateUrl: './company-model.component.html',
  styleUrls: ['./company-model.component.css'],
  providers: [CompanyModelLoaderService],
})
export class CompanyModelComponent {
  constructor(private companyModelLoaderService: CompanyModelLoaderService) {}

  get companyModel(): CompanyModel | undefined {
    return this.companyModelLoaderService.companyModel;
  }
}
