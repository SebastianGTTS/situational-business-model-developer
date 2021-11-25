import { Injectable } from '@angular/core';
import { CompanyModelService } from '../../canvas-meta-model/company-model.service';
import { CompanyModel } from '../../canvas-meta-model/company-model';
import { Instance } from '../../canvas-meta-model/instance';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ElementLoaderService } from '../../database/element-loader.service';

@Injectable()
export class InstanceLoaderService extends ElementLoaderService {
  companyModel: CompanyModel = null;
  instance: Instance = null;

  constructor(
    private companyModelService: CompanyModelService,
    route: ActivatedRoute
  ) {
    super(route);
  }

  protected initParams(paramMap: ParamMap) {
    const companyModelId = paramMap.get('companyModelId');
    const instanceId = +paramMap.get('instanceId');
    this.changesFeed = this.companyModelService
      .getChangesFeed(companyModelId)
      .subscribe(() => this.loadInstance(companyModelId, instanceId));
    void this.loadInstance(companyModelId, instanceId);
  }

  private async loadInstance(companyModelId: string, instanceId: number) {
    this.companyModel = await this.companyModelService.get(companyModelId);
    this.instance = this.companyModel.getInstance(instanceId);
    this.elementLoaded();
  }
}
