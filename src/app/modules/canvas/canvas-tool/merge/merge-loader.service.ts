import { Injectable } from '@angular/core';
import { ElementLoaderService } from '../../../../database/element-loader.service';
import { ExpertModel } from '../../canvas-meta-artifact/expert-model';
import { CompanyModel } from '../../canvas-meta-artifact/company-model';
import { ExpertModelService } from '../../canvas-meta-artifact/expert-model.service';
import { CompanyModelService } from '../../canvas-meta-artifact/company-model.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DbId } from '../../../../database/database-entry';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class MergeLoaderService extends ElementLoaderService {
  companyModel?: CompanyModel;
  expertModel?: ExpertModel;

  constructor(
    private companyModelService: CompanyModelService,
    private expertModelService: ExpertModelService,
    route: ActivatedRoute
  ) {
    super(route);
  }

  protected initParams(paramMap: ParamMap): void {
    const companyModelId = paramMap.get('companyModelId');
    const expertModelId = paramMap.get('expertModelId');
    if (companyModelId != null && expertModelId != null) {
      const companyModelChange = this.companyModelService
        .getChangesFeed(companyModelId)
        .pipe(tap(() => this.loadCompanyModel(companyModelId, true)));
      const expertModelChange = this.expertModelService
        .getChangesFeed(expertModelId)
        .pipe(tap(() => this.loadExpertModel(expertModelId, true)));
      this.changesFeed = merge(
        companyModelChange,
        expertModelChange
      ).subscribe();
      void this.loadModels(companyModelId, expertModelId);
    } else {
      this.companyModel = undefined;
      this.expertModel = undefined;
    }
  }

  private async loadModels(
    companyModelId: DbId,
    expertModelId: DbId
  ): Promise<void> {
    await Promise.all([
      this.loadExpertModel(expertModelId, false),
      this.loadCompanyModel(companyModelId, false),
    ]);
    this.elementLoaded();
  }

  private async loadExpertModel(
    expertModelId: DbId,
    loaded: boolean
  ): Promise<void> {
    this.expertModel = await this.expertModelService.get(expertModelId);
    if (loaded && this.companyModel != null) {
      this.elementLoaded();
    }
  }

  private async loadCompanyModel(
    companyModelId: DbId,
    loaded: boolean
  ): Promise<void> {
    this.companyModel = await this.companyModelService.get(companyModelId);
    if (loaded && this.expertModel != null) {
      this.elementLoaded();
    }
  }
}
