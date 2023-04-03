import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ExpertModel } from '../../canvas-meta-artifact/expert-model';
import { ExpertModelService } from '../../canvas-meta-artifact/expert-model.service';
import { ElementLoaderService } from '../../../../database/element-loader.service';

@Injectable()
export class ExpertModelLoaderService extends ElementLoaderService {
  expertModel?: ExpertModel;

  constructor(
    private expertModelService: ExpertModelService,
    route: ActivatedRoute
  ) {
    super(route);
  }

  protected initParams(paramMap: ParamMap): void {
    const expertModelId = paramMap.get('id');
    if (expertModelId != null) {
      this.changesFeed = this.expertModelService
        .getChangesFeed(expertModelId)
        .subscribe(() => this.loadExpertModel(expertModelId));
      void this.loadExpertModel(expertModelId);
    }
  }

  private async loadExpertModel(bmProcessId: string): Promise<void> {
    this.expertModel = await this.expertModelService.get(bmProcessId);
    this.elementLoaded();
  }
}
