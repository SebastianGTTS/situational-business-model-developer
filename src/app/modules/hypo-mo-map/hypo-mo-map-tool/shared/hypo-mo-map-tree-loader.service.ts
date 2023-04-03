import { Injectable } from '@angular/core';
import { HypoMoMapTree } from '../../hypo-mo-map-meta-artifact/hypo-mo-map-tree';
import { ElementLoaderService } from '../../../../database/element-loader.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HypoMoMapTreeService } from '../../hypo-mo-map-meta-artifact/hypo-mo-map-tree.service';
import { DbId } from '../../../../database/database-entry';

@Injectable()
export class HypoMoMapTreeLoaderService extends ElementLoaderService {
  hypoMoMapTree?: HypoMoMapTree;

  constructor(
    private hypoMoMapTreeService: HypoMoMapTreeService,
    route: ActivatedRoute
  ) {
    super(route);
  }

  protected initParams(paramMap: ParamMap): void {
    const hypoMoMapTreeId = paramMap.get('id');
    if (hypoMoMapTreeId != null) {
      this.changesFeed = this.hypoMoMapTreeService
        .getChangesFeed(hypoMoMapTreeId)
        .subscribe(() => this.loadHypoMoMapTree(hypoMoMapTreeId));
      void this.loadHypoMoMapTree(hypoMoMapTreeId);
    } else {
      this.hypoMoMapTree = undefined;
    }
  }

  private async loadHypoMoMapTree(hypoMoMapTreeId: DbId): Promise<void> {
    this.hypoMoMapTree = await this.hypoMoMapTreeService.get(hypoMoMapTreeId);
    this.elementLoaded();
  }
}
