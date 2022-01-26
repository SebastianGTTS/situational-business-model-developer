import { Injectable } from '@angular/core';
import { ElementLoaderService } from '../../database/element-loader.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { WhiteboardTemplate } from '../../whiteboard-meta-model/whiteboard-template';
import { WhiteboardTemplateService } from '../../whiteboard-meta-model/whiteboard-template.service';
import { DbId } from '../../database/database-entry';

@Injectable()
export class WhiteboardTemplateLoaderService extends ElementLoaderService {
  whiteboardTemplate?: WhiteboardTemplate;

  constructor(
    private whiteboardTemplateService: WhiteboardTemplateService,
    route: ActivatedRoute
  ) {
    super(route);
  }

  protected initParams(paramMap: ParamMap): void {
    const whiteboardTemplateId = paramMap.get('id')!;
    this.changesFeed = this.whiteboardTemplateService
      .getChangesFeed(whiteboardTemplateId)
      .subscribe(() => this.loadWhiteboardTemplate(whiteboardTemplateId));
    void this.loadWhiteboardTemplate(whiteboardTemplateId);
  }

  private async loadWhiteboardTemplate(
    whiteboardTemplateId: DbId
  ): Promise<void> {
    this.whiteboardTemplate = await this.whiteboardTemplateService.get(
      whiteboardTemplateId
    );
    this.elementLoaded();
  }
}
