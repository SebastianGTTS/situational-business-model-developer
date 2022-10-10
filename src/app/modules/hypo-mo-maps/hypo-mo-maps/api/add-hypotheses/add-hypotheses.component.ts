import { Component, OnInit } from '@angular/core';
import { ProcessApiService } from '../../../../../development-process-registry/module-api/process-api.service';
import { HypoMoMapLoaderService } from '../../shared/hypo-mo-map-loader.service';
import { RunningProcessService } from '../../../../../development-process-registry/running-process/running-process.service';
import { HypoMoMap } from '../../../hypo-mo-map-meta-model/hypo-mo-map';
import { HypoMoMapResolveService } from '../../hypo-mo-map-resolve.service';
import { HypoMoMapTree } from '../../../hypo-mo-map-meta-model/hypo-mo-map-tree';
import { Hypothesis } from '../../../hypo-mo-map-meta-model/hypothesis';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HypoMoMapTreeService } from '../../../hypo-mo-map-meta-model/hypo-mo-map-tree.service';
import { RunningProcessMethodCommentsMixin } from '../../../../../development-process-view/shared/running-process-method-comments.mixin';
import { EmptyClass } from '../../../../../shared/utils';
import { ProcessApiMixin } from '../../../../../development-process-view/shared/process-api.mixin';
import { HypothesesEditMixin } from '../../shared/hypotheses-edit.mixin';

function getBase(): ReturnType<typeof HypothesesEditMixin> &
  ReturnType<typeof RunningProcessMethodCommentsMixin> &
  ReturnType<typeof ProcessApiMixin> {
  return HypothesesEditMixin(
    ProcessApiMixin(RunningProcessMethodCommentsMixin(EmptyClass))
  );
}

@Component({
  selector: 'app-add-hypotheses',
  templateUrl: './add-hypotheses.component.html',
  styleUrls: ['./add-hypotheses.component.css'],
  providers: [ProcessApiService, HypoMoMapLoaderService],
})
export class AddHypothesesComponent extends getBase() implements OnInit {
  hypothesisList: Hypothesis[] | undefined;

  // noinspection JSUnusedGlobalSymbols
  constructor(
    protected processApiService: ProcessApiService,
    protected runningProcessService: RunningProcessService,
    private hypoMoMapLoaderService: HypoMoMapLoaderService,
    private hypoMoMapResolveService: HypoMoMapResolveService,
    protected hypoMoMapTreeService: HypoMoMapTreeService,
    protected modalService: NgbModal
  ) {
    super();
  }

  ngOnInit(): void {
    this.hypoMoMapLoaderService.loaded.subscribe(() => {
      this.hypothesisList = this.hypoMoMap?.getHypothesisList();
      this.onLoaded();
    });
  }

  async finish(): Promise<void> {
    if (this.processApiService.stepInfo != null && this.hypoMoMapTree != null) {
      await this.hypoMoMapResolveService.resolve(
        this.processApiService.stepInfo,
        this.hypoMoMapTree._id
      );
    }
  }

  protected get hypoMoMapTree(): HypoMoMapTree | undefined {
    return this.hypoMoMapLoaderService.hypoMoMapTree;
  }

  get hypoMoMap(): HypoMoMap | undefined {
    return this.hypoMoMapLoaderService.hypoMoMap;
  }
}
