import { Component, QueryList, ViewChildren } from '@angular/core';
import { ExperimentDefinitionLoaderService } from '../../shared/experiment-definition-loader.service';
import { ExperimentDefinition } from '../../../hypo-mo-map-meta-artifact/experiment-definition';
import { Updatable, UPDATABLE } from '../../../../../shared/updatable';
import { AuthorInit } from '../../../../../model/author';
import { ExperimentRepoService } from '../../../hypo-mo-map-meta-artifact/experiment-repo.service';
import { IconInit } from '../../../../../model/icon';

@Component({
  selector: 'app-experiment-definition-general',
  templateUrl: './experiment-definition-general.component.html',
  styleUrls: ['./experiment-definition-general.component.scss'],
  providers: [
    { provide: UPDATABLE, useExisting: ExperimentDefinitionGeneralComponent },
  ],
})
export class ExperimentDefinitionGeneralComponent implements Updatable {
  @ViewChildren(UPDATABLE) updatable!: QueryList<Updatable>;

  constructor(
    private experimentDefinitionLoaderService: ExperimentDefinitionLoaderService,
    private experimentRepoService: ExperimentRepoService
  ) {}

  async updateAuthor(authorInfo: AuthorInit): Promise<void> {
    if (this.experimentDefinition != null) {
      await this.experimentRepoService.updateExperimentDefinitionAuthor(
        this.experimentDefinition._id,
        authorInfo
      );
    }
  }

  async updateExperiment(name: string, description: string): Promise<void> {
    if (this.experimentDefinition != null) {
      await this.experimentRepoService.updateExperiment(
        this.experimentDefinition._id,
        this.experimentDefinition.experiment.id,
        this.experimentDefinition.experiment.parent?.id,
        {
          name: name,
          description: description,
        }
      );
    }
  }

  async updateIcon(icon: IconInit): Promise<void> {
    if (this.experimentDefinition != null) {
      await this.experimentRepoService.updateExperimentIcon(
        this.experimentDefinition._id,
        this.experimentDefinition.experiment.id,
        icon
      );
    }
  }

  update(): void {
    for (const updatable of this.updatable) {
      updatable.update();
    }
  }

  get experimentDefinition(): ExperimentDefinition | undefined {
    return this.experimentDefinitionLoaderService.experimentDefinition;
  }
}
