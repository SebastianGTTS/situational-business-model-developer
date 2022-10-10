import { Injectable } from '@angular/core';
import { CompanyModelService } from '../../canvas-meta-model/company-model.service';
import { CompanyModel } from '../../canvas-meta-model/company-model';
import { Instance } from '../../canvas-meta-model/instance';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ElementLoaderService } from '../../../../database/element-loader.service';

@Injectable()
export class InstanceLoaderService extends ElementLoaderService {
  companyModel?: CompanyModel;
  instance?: Instance;

  constructor(
    private companyModelService: CompanyModelService,
    route: ActivatedRoute
  ) {
    super(route);
  }

  protected initParams(paramMap: ParamMap): void {
    const companyModelId = paramMap.get('companyModelId');
    const instanceIdStr = paramMap.get('instanceId');
    const instanceId = instanceIdStr ? +instanceIdStr : undefined;
    if (companyModelId != null && instanceId != null) {
      this.changesFeed = this.companyModelService
        .getChangesFeed(companyModelId)
        .subscribe(() => this.loadInstance(companyModelId, instanceId));
      void this.loadInstance(companyModelId, instanceId);
    }
  }

  private async loadInstance(
    companyModelId: string,
    instanceId: number
  ): Promise<void> {
    this.companyModel = await this.companyModelService.get(companyModelId);
    this.instance = this.companyModel.getInstance(instanceId);
    this.elementLoaded();
  }
}
