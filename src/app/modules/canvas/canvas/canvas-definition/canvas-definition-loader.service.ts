import { Injectable } from '@angular/core';
import { ElementLoaderService } from '../../../../database/element-loader.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CanvasDefinition } from '../../canvas-meta-model/canvas-definition';
import { CanvasDefinitionService } from '../../canvas-meta-model/canvas-definition.service';

@Injectable()
export class CanvasDefinitionLoaderService extends ElementLoaderService {
  canvasDefinition?: CanvasDefinition;

  constructor(
    private canvasDefinitionService: CanvasDefinitionService,
    route: ActivatedRoute
  ) {
    super(route);
  }

  protected initParams(paramMap: ParamMap): void {
    const canvasDefinitionId = paramMap.get('id');
    if (canvasDefinitionId != null) {
      this.changesFeed = this.canvasDefinitionService
        .getChangesFeed(canvasDefinitionId)
        .subscribe(() => this.loadCanvasDefinition(canvasDefinitionId));
      void this.loadCanvasDefinition(canvasDefinitionId);
    }
  }

  private async loadCanvasDefinition(
    canvasDefinitionId: string
  ): Promise<void> {
    this.canvasDefinition = await this.canvasDefinitionService.get(
      canvasDefinitionId
    );
    this.elementLoaded();
  }
}
