import { Component, OnInit } from '@angular/core';
import { ProcessApiService } from '../../../../../development-process-registry/module-api/process-api.service';
import { HypoMoMapLoaderService } from '../../shared/hypo-mo-map-loader.service';
import { ProcessApiMixin } from '../../../../../development-process-view/shared/process-api.mixin';
import { EmptyClass } from '../../../../../shared/utils';
import { HypothesesEditMixin } from '../../shared/hypotheses-edit.mixin';
import { ExperimentsEditMixin } from '../../shared/experiments-edit.mixin';
import { ExperimentRepoService } from '../../../hypo-mo-map-meta-artifact/experiment-repo.service';
import { RunningProcessMethodCommentsMixin } from '../../../../../development-process-view/shared/running-process-method-comments.mixin';
import { RunningProcessService } from '../../../../../development-process-registry/running-process/running-process.service';
import { Router } from '@angular/router';
import { Hypothesis } from '../../../hypo-mo-map-meta-artifact/hypothesis';
import { HypoMoMapTreeService } from '../../../hypo-mo-map-meta-artifact/hypo-mo-map-tree.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HypoMoMapTree } from '../../../hypo-mo-map-meta-artifact/hypo-mo-map-tree';
import {
  HypoMoMap,
  HypothesisMappingsMap,
} from '../../../hypo-mo-map-meta-artifact/hypo-mo-map';
import { HypoMoMapToolResolveService } from '../../hypo-mo-map-tool-resolve.service';

function getBase(): ReturnType<typeof ProcessApiMixin> &
  ReturnType<typeof RunningProcessMethodCommentsMixin> &
  ReturnType<typeof ExperimentsEditMixin> &
  ReturnType<typeof HypothesesEditMixin> {
  return ExperimentsEditMixin(
    HypothesesEditMixin(
      RunningProcessMethodCommentsMixin(ProcessApiMixin(EmptyClass))
    )
  );
}

@Component({
  selector: 'app-edit-hypo-mo-map',
  templateUrl: './edit-hypo-mo-map.component.html',
  styleUrls: ['./edit-hypo-mo-map.component.css'],
  providers: [ProcessApiService, HypoMoMapLoaderService],
})
export class EditHypoMoMapComponent extends getBase() implements OnInit {
  protected hypoMoMapTree: HypoMoMapTree | undefined;

  hypoMoMap: HypoMoMap | undefined;

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
    private router: Router,
    protected runningProcessService: RunningProcessService
  ) {
    super();
  }

  ngOnInit(): void {
    this.hypoMoMapLoaderService.loaded.subscribe(() => {
      this.hypoMoMap = this.hypoMoMapLoaderService.hypoMoMap;
      this.hypoMoMapTree = this.hypoMoMapLoaderService.hypoMoMapTree;
      if (this.hypoMoMap != null) {
        if (
          this.hypoMoMapTree != null &&
          this.hypoMoMap.id != this.hypoMoMapTree.getLatestHypoMoMap().id
        ) {
          void this.router.navigate(
            [
              'hypomomaps',
              'hypomomaps',
              this.hypoMoMapTree._id,
              'version',
              this.hypoMoMapTree.getLatestHypoMoMap().id,
              'edit',
            ],
            {
              queryParamsHandling: 'preserve',
            }
          );
          return;
        }
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
    if (
      this.hypoMoMapTree != null &&
      this.processApiService.stepInfo != null &&
      this.processApiService.stepInfo.step != null
    ) {
      await this.hypoMoMapResolveService.resolve(
        this.processApiService.stepInfo,
        this.hypoMoMapTree._id
      );
    } else if (
      this.runningProcess != null &&
      this.processApiService.artifactVersionId != null
    ) {
      await this.hypoMoMapResolveService.resolveEditHypoMoMapManually(
        this.runningProcess._id,
        this.processApiService.artifactVersionId
      );
    }
  }

  async executeExperiment(
    experimentDefinitionId: string,
    experimentId: string,
    results: { hypothesisId: string; evidence: number; approved: boolean }[]
  ): Promise<void> {
    if (this.hypoMoMapTree != null && this.hypoMoMap != null) {
      await this.hypoMoMapTreeService.executeExperiment(
        this.hypoMoMapTree._id,
        this.hypoMoMap.id,
        experimentDefinitionId,
        experimentId,
        results
      );
      const tree = await this.hypoMoMapTreeService.get(this.hypoMoMapTree._id);
      const hypoMoMap = tree.getHypoMoMap(this.hypoMoMap.id);
      if (hypoMoMap != null) {
        const id = this.hypoMoMapTree._id;
        const versionId =
          hypoMoMap.adaptions[hypoMoMap.adaptions.length - 1].id;
        await this.router.navigate(
          ['hypomomaps', 'hypomomaps', id, 'version', versionId, 'edit'],
          { queryParamsHandling: 'preserve' }
        );
      }
    }
  }

  isManually(): boolean {
    return this.processApiService.stepInfo?.step == null;
  }
}
