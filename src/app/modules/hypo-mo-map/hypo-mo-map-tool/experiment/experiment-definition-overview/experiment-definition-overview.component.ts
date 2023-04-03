import { Component } from '@angular/core';
import { ExperimentDefinition } from '../../../hypo-mo-map-meta-artifact/experiment-definition';
import { ExperimentDefinitionLoaderService } from '../../shared/experiment-definition-loader.service';

@Component({
  selector: 'app-experiment-definition-overview',
  templateUrl: './experiment-definition-overview.component.html',
  styleUrls: ['./experiment-definition-overview.component.scss'],
})
export class ExperimentDefinitionOverviewComponent {
  constructor(
    private experimentDefinitionLoaderService: ExperimentDefinitionLoaderService
  ) {}

  get experimentDefinition(): ExperimentDefinition | undefined {
    return this.experimentDefinitionLoaderService.experimentDefinition;
  }
}
