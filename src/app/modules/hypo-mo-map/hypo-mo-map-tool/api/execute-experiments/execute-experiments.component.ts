import { Component, OnInit } from '@angular/core';
import { EmptyClass } from '../../../../../shared/utils';
import { ProcessApiMixin } from '../../../../../development-process-view/shared/process-api.mixin';
import { ProcessApiService } from '../../../../../development-process-registry/module-api/process-api.service';
import { HypoMoMapLoaderService } from '../../shared/hypo-mo-map-loader.service';
import { HypoMoMapTree } from '../../../hypo-mo-map-meta-artifact/hypo-mo-map-tree';
import { HypoMoMap } from '../../../hypo-mo-map-meta-artifact/hypo-mo-map';
import { HypoMoMapToolResolveService } from '../../hypo-mo-map-tool-resolve.service';
import { RunningProcessService } from '../../../../../development-process-registry/running-process/running-process.service';
import { RunningProcessMethodCommentsMixin } from '../../../../../development-process-view/shared/running-process-method-comments.mixin';
import { ActivatedRoute, Router } from '@angular/router';
import { HypoMoMapTreeService } from '../../../hypo-mo-map-meta-artifact/hypo-mo-map-tree.service';

function getBase(): ReturnType<typeof ProcessApiMixin> &
  ReturnType<typeof RunningProcessMethodCommentsMixin> {
  return RunningProcessMethodCommentsMixin(ProcessApiMixin(EmptyClass));
}

@Component({
  selector: 'app-execute-experiments',
  templateUrl: './execute-experiments.component.html',
  styleUrls: ['./execute-experiments.component.css'],
  providers: [ProcessApiService, HypoMoMapLoaderService],
})
export class ExecuteExperimentsComponent extends getBase() implements OnInit {
  constructor(
    private hypoMoMapLoaderService: HypoMoMapLoaderService,
    private hypoMoMapResolveService: HypoMoMapToolResolveService,
    protected hypoMoMapTreeService: HypoMoMapTreeService,
    protected processApiService: ProcessApiService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected runningProcessService: RunningProcessService
  ) {
    super();
  }

  ngOnInit(): void {
    this.hypoMoMapLoaderService.loaded.subscribe(() => {
      if (
        this.hypoMoMapTree != null &&
        this.hypoMoMap != null &&
        this.hypoMoMap.id != this.hypoMoMapTree.getLatestHypoMoMap().id
      ) {
        void this.router.navigate(
          [
            'hypomomaps',
            'hypomomaps',
            this.hypoMoMapTree._id,
            'version',
            this.hypoMoMapTree.getLatestHypoMoMap().id,
            'execute',
          ],
          {
            queryParamsHandling: 'preserve',
          }
        );
      }
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
          ['hypomomaps', 'hypomomaps', id, 'version', versionId, 'execute'],
          { queryParamsHandling: 'preserve' }
        );
      }
    }
  }

  protected get hypoMoMapTree(): HypoMoMapTree | undefined {
    return this.hypoMoMapLoaderService.hypoMoMapTree;
  }

  get hypoMoMap(): HypoMoMap | undefined {
    return this.hypoMoMapLoaderService.hypoMoMap;
  }
}
