import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DbId } from '../../../../database/database-entry';
import { WhiteboardInstance } from '../../whiteboard-meta-artifact/whiteboard-instance';
import { WhiteboardInstanceService } from '../../whiteboard-meta-artifact/whiteboard-instance.service';
import { ElementLoaderService } from '../../../../database/element-loader.service';

@Injectable({
  providedIn: 'root',
})
export class WhiteboardInstanceLoaderService extends ElementLoaderService {
  whiteboardInstance?: WhiteboardInstance;

  constructor(
    private whiteboardInstanceService: WhiteboardInstanceService,
    route: ActivatedRoute
  ) {
    super(route);
  }

  protected initParams(paramMap: ParamMap): void {
    const whiteboardInstanceId = paramMap.get('id');
    if (whiteboardInstanceId != null) {
      this.changesFeed = this.whiteboardInstanceService
        .getChangesFeed(whiteboardInstanceId)
        .subscribe(() => this.loadWhiteboardInstance(whiteboardInstanceId));
      void this.loadWhiteboardInstance(whiteboardInstanceId);
    } else {
      this.whiteboardInstance = undefined;
    }
  }

  private async loadWhiteboardInstance(
    whiteboardInstanceId: DbId
  ): Promise<void> {
    this.whiteboardInstance = await this.whiteboardInstanceService.get(
      whiteboardInstanceId
    );
    this.elementLoaded();
  }
}
