import { Injectable } from '@angular/core';
import { ElementLoaderService } from '../../../../database/element-loader.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CompanyModel } from '../../canvas-meta-artifact/company-model';
import { CompanyModelService } from '../../canvas-meta-artifact/company-model.service';

@Injectable()
export class CompanyModelLoaderService extends ElementLoaderService {
  companyModel?: CompanyModel;

  constructor(
    private companyModelService: CompanyModelService,
    route: ActivatedRoute
  ) {
    super(route);
  }

  protected initParams(paramMap: ParamMap): void {
    const companyModelId = paramMap.get('id');
    if (companyModelId != null) {
      this.changesFeed = this.companyModelService
        .getChangesFeed(companyModelId)
        .subscribe(() => this.loadCompanyModel(companyModelId));
      void this.loadCompanyModel(companyModelId);
    }
  }

  private async loadCompanyModel(companyModelId: string): Promise<void> {
    this.companyModel = await this.companyModelService.get(companyModelId);
    this.elementLoaded();
  }
}
