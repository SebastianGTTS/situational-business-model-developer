import { Injectable } from '@angular/core';
import { ElementLoaderService } from '../../database/element-loader.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CanvasDefinition } from '../../canvas-meta-model/canvas-definition';
import { CanvasDefinitionService } from '../../canvas-meta-model/canvas-definition.service';

@Injectable()
export class CanvasDefinitionLoaderService extends ElementLoaderService {
  canvasDefinition: CanvasDefinition = null;

  constructor(
    private canvasDefinitionService: CanvasDefinitionService,
    route: ActivatedRoute
  ) {
    super(route);
  }

  protected initParams(paramMap: ParamMap) {
    const canvasDefinitionId = paramMap.get('id');
    this.changesFeed = this.canvasDefinitionService
      .getChangesFeed(canvasDefinitionId)
      .subscribe(() => this.loadCanvasDefinition(canvasDefinitionId));
    void this.loadCanvasDefinition(canvasDefinitionId);
  }

  private async loadCanvasDefinition(canvasDefinitionId: string) {
    this.canvasDefinition = await this.canvasDefinitionService.get(
      canvasDefinitionId
    );
    this.elementLoaded();
  }
}
