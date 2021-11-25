import { Injectable } from '@angular/core';
import { ElementLoaderService } from '../../database/element-loader.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CompanyModel } from '../../canvas-meta-model/company-model';
import { CompanyModelService } from '../../canvas-meta-model/company-model.service';

@Injectable({
  providedIn: 'root',
})
export class CompanyModelLoaderService extends ElementLoaderService {
  companyModel: CompanyModel = null;

  constructor(
    private companyModelService: CompanyModelService,
    route: ActivatedRoute
  ) {
    super(route);
  }

  protected initParams(paramMap: ParamMap) {
    const companyModelId = paramMap.get('id');
    this.changesFeed = this.companyModelService
      .getChangesFeed(companyModelId)
      .subscribe(() => this.loadCompanyModel(companyModelId));
    void this.loadCompanyModel(companyModelId);
  }

  private async loadCompanyModel(companyModelId: string) {
    this.companyModel = await this.companyModelService.get(companyModelId);
    this.elementLoaded();
  }
}