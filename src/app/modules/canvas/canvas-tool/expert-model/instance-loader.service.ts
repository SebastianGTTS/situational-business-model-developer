import { Injectable } from '@angular/core';
import { ExpertModelLoaderService } from './expert-model-loader.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ExpertModelService } from '../../canvas-meta-artifact/expert-model.service';
import { Instance } from '../../canvas-meta-artifact/instance';

@Injectable()
export class InstanceLoaderService extends ExpertModelLoaderService {
  instance?: Instance;
  private instanceId?: number;

  constructor(expertModelService: ExpertModelService, route: ActivatedRoute) {
    super(expertModelService, route);
  }

  protected initParams(paramMap: ParamMap): void {
    const instanceIdStr = paramMap.get('instanceId') ?? undefined;
    this.instanceId = instanceIdStr != null ? +instanceIdStr : undefined;
    super.initParams(paramMap);
  }

  protected elementLoaded(): void {
    this.instance = this.expertModel?.getInstance(this.instanceId);
    super.elementLoaded();
  }
}
