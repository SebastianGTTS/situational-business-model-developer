import { Injectable } from '@angular/core';
import { ElementLoaderService } from '../../../../database/element-loader.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ExperimentRepoService } from '../../hypo-mo-map-meta-model/experiment-repo.service';
import { ExperimentDefinition } from '../../hypo-mo-map-meta-model/experiment-definition';
import { DbId } from '../../../../database/database-entry';

@Injectable()
export class ExperimentDefinitionLoaderService extends ElementLoaderService {
  experimentDefinition?: ExperimentDefinition;

  constructor(
    private experimentRepoService: ExperimentRepoService,
    route: ActivatedRoute
  ) {
    super(route);
  }

  protected initParams(paramMap: ParamMap): void {
    const experimentDefinitionId = paramMap.get('id');
    if (experimentDefinitionId != null) {
      this.changesFeed = this.experimentRepoService
        .getChangesFeed(experimentDefinitionId)
        .subscribe(() => this.loadExperimentDefinition(experimentDefinitionId));
      void this.loadExperimentDefinition(experimentDefinitionId);
    } else {
      this.experimentDefinition = undefined;
    }
  }

  private async loadExperimentDefinition(
    experimentDefinitionId: DbId
  ): Promise<void> {
    this.experimentDefinition = await this.experimentRepoService.get(
      experimentDefinitionId
    );
    this.elementLoaded();
  }
}
