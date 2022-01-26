import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BmProcess } from '../../development-process-registry/bm-process/bm-process';
import { BmProcessService } from '../../development-process-registry/bm-process/bm-process.service';
import { ElementLoaderService } from '../../database/element-loader.service';

@Injectable()
export class BmProcessLoaderService extends ElementLoaderService {
  bmProcess: BmProcess = null;

  constructor(
    private bmProcessService: BmProcessService,
    route: ActivatedRoute
  ) {
    super(route);
  }

  protected initParams(paramMap: ParamMap): void {
    const bmProcessId = paramMap.get('id');
    this.changesFeed = this.bmProcessService
      .getChangesFeed(bmProcessId)
      .subscribe(() => this.loadBmProcess(bmProcessId));
    void this.loadBmProcess(bmProcessId);
  }

  private async loadBmProcess(bmProcessId: string): Promise<void> {
    this.bmProcess = await this.bmProcessService.get(bmProcessId);
    this.elementLoaded();
  }
}
