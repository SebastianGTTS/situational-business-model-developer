import { Component, OnInit } from '@angular/core';
import { RunningProcessMethodCommentsMixin } from '../../../../../development-process-view/shared/running-process-method-comments.mixin';
import { ProcessApiMixin } from '../../../../../development-process-view/shared/process-api.mixin';
import { EmptyClass } from '../../../../../shared/utils';
import { ProcessApiService } from '../../../../../development-process-registry/module-api/process-api.service';
import { HypoMoMapLoaderService } from '../../shared/hypo-mo-map-loader.service';
import { RunningProcessService } from '../../../../../development-process-registry/running-process/running-process.service';
import {
  HypoMoMap,
  HypothesisMappingsMap,
} from '../../../hypo-mo-map-meta-artifact/hypo-mo-map';
import { HypoMoMapTree } from '../../../hypo-mo-map-meta-artifact/hypo-mo-map-tree';
import { HypoMoMapToolResolveService } from '../../hypo-mo-map-tool-resolve.service';
import { ExperimentsEditMixin } from '../../shared/experiments-edit.mixin';
import { ExperimentRepoService } from '../../../hypo-mo-map-meta-artifact/experiment-repo.service';
import { HypoMoMapTreeService } from '../../../hypo-mo-map-meta-artifact/hypo-mo-map-tree.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Hypothesis } from '../../../hypo-mo-map-meta-artifact/hypothesis';

function getBase(): ReturnType<typeof RunningProcessMethodCommentsMixin> &
  ReturnType<typeof ProcessApiMixin> &
  ReturnType<typeof ExperimentsEditMixin> {
  return ExperimentsEditMixin(
    ProcessApiMixin(RunningProcessMethodCommentsMixin(EmptyClass))
  );
}

@Component({
  selector: 'app-add-experiments',
  templateUrl: './add-experiments.component.html',
  styleUrls: ['./add-experiments.component.css'],
  providers: [ProcessApiService, HypoMoMapLoaderService],
})
export class AddExperimentsComponent extends getBase() implements OnInit {
  hypothesisExperimentMap: HypothesisMappingsMap = {};

  protected hypothesisList: Hypothesis[] | undefined;

  // noinspection JSUnusedGlobalSymbols
  constructor(
    protected experimentRepoService: ExperimentRepoService,
    private hypoMoMapLoaderService: HypoMoMapLoaderService,
    private hypoMoMapResolveService: HypoMoMapToolResolveService,
    protected hypoMoMapTreeService: HypoMoMapTreeService,
    protected modalService: NgbModal,
    protected processApiService: ProcessApiService,
    protected runningProcessService: RunningProcessService
  ) {
    super();
  }

  ngOnInit(): void {
    this.hypoMoMapLoaderService.loaded.subscribe(() => {
      if (this.hypoMoMap != null) {
        this.hypothesisList = this.hypoMoMap.getHypothesisList();
        this.hypothesisExperimentMap =
          this.hypoMoMap.getHypothesisMappingsMap();
      } else {
        this.hypothesisList = undefined;
        this.hypothesisExperimentMap = {};
      }
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
