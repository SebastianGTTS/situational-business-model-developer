import { Component, OnInit } from '@angular/core';
import { ProcessApiMixin } from '../../../../../development-process-view/shared/process-api.mixin';
import { EmptyClass } from '../../../../../shared/utils';
import { ProcessApiService } from '../../../../../development-process-registry/module-api/process-api.service';
import { HypoMoMapLoaderService } from '../../shared/hypo-mo-map-loader.service';
import {
  HypoMoMap,
  HypothesisMappingsMap,
} from '../../../hypo-mo-map-meta-artifact/hypo-mo-map';
import { RunningProcessMethodCommentsMixin } from '../../../../../development-process-view/shared/running-process-method-comments.mixin';
import { RunningProcessService } from '../../../../../development-process-registry/running-process/running-process.service';
import { HypoMoMapToolResolveService } from '../../hypo-mo-map-tool-resolve.service';

function getBase(): ReturnType<typeof ProcessApiMixin> &
  ReturnType<typeof RunningProcessMethodCommentsMixin> {
  return RunningProcessMethodCommentsMixin(ProcessApiMixin(EmptyClass));
}

@Component({
  selector: 'app-view-hypo-mo-map',
  templateUrl: './view-hypo-mo-map.component.html',
  styleUrls: ['./view-hypo-mo-map.component.css'],
  providers: [ProcessApiService, HypoMoMapLoaderService],
})
export class ViewHypoMoMapComponent extends getBase() implements OnInit {
  hypothesisMappingsMap: HypothesisMappingsMap = {};

  constructor(
    private hypoMoMapLoaderService: HypoMoMapLoaderService,
    private hypoMoMapResolveService: HypoMoMapToolResolveService,
    protected processApiService: ProcessApiService,
    protected runningProcessService: RunningProcessService
  ) {
    super();
  }

  ngOnInit(): void {
    this.hypoMoMapLoaderService.loaded.subscribe(() => {
      if (this.hypoMoMap != null) {
        this.hypothesisMappingsMap = this.hypoMoMap.getHypothesisMappingsMap();
      } else {
        this.hypothesisMappingsMap = {};
      }
    });
  }

  async finish(): Promise<void> {
    if (
      this.hypoMoMapLoaderService.hypoMoMapTree != null &&
      this.processApiService.stepInfo != null &&
      this.processApiService.stepInfo.step != null
    ) {
      await this.hypoMoMapResolveService.resolve(
        this.processApiService.stepInfo,
        this.hypoMoMapLoaderService.hypoMoMapTree._id
      );
    }
  }

  isManually(): boolean {
    return this.processApiService.stepInfo?.step == null;
  }

  get hypoMoMap(): HypoMoMap | undefined {
    return this.hypoMoMapLoaderService.hypoMoMap;
  }
}
