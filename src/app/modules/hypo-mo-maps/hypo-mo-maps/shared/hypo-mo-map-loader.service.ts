import { Injectable } from '@angular/core';
import { HypoMoMapTreeLoaderService } from './hypo-mo-map-tree-loader.service';
import { HypoMoMapTreeService } from '../../hypo-mo-map-meta-model/hypo-mo-map-tree.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HypoMoMap } from '../../hypo-mo-map-meta-model/hypo-mo-map';

@Injectable()
export class HypoMoMapLoaderService extends HypoMoMapTreeLoaderService {
  hypoMoMap?: HypoMoMap;
  private versionId?: string;

  constructor(
    hypoMoMapTreeService: HypoMoMapTreeService,
    route: ActivatedRoute
  ) {
    super(hypoMoMapTreeService, route);
    this.loaded.subscribe(() => {
      this.hypoMoMap = this.hypoMoMapTree?.getHypoMoMap(this.versionId);
    });
  }

  protected initParams(paramMap: ParamMap): void {
    this.versionId = paramMap.get('versionId') ?? undefined;
    super.initParams(paramMap);
  }
}
