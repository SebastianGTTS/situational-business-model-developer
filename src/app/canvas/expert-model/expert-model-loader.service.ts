import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ExpertModel } from '../../canvas-meta-model/expert-model';
import { ExpertModelService } from '../../canvas-meta-model/expert-model.service';
import { ElementLoaderService } from '../../database/element-loader.service';

@Injectable()
export class ExpertModelLoaderService extends ElementLoaderService {
  expertModel: ExpertModel = null;

  constructor(
    private expertModelService: ExpertModelService,
    route: ActivatedRoute
  ) {
    super(route);
  }

  protected initParams(paramMap: ParamMap) {
    const expertModelId = paramMap.get('id');
    this.changesFeed = this.expertModelService
      .getChangesFeed(expertModelId)
      .subscribe(() => this.loadExpertModel(expertModelId));
    void this.loadExpertModel(expertModelId);
  }

  private async loadExpertModel(bmProcessId: string) {
    this.expertModel = await this.expertModelService.get(bmProcessId);
    this.elementLoaded();
  }
}
