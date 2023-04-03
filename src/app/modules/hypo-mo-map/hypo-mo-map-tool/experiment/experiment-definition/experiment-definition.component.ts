import { Component } from '@angular/core';
import { ExperimentDefinitionLoaderService } from '../../shared/experiment-definition-loader.service';
import { ExperimentDefinition } from '../../../hypo-mo-map-meta-artifact/experiment-definition';

@Component({
  selector: 'app-experiment-definition',
  templateUrl: './experiment-definition.component.html',
  styleUrls: ['./experiment-definition.component.css'],
  providers: [ExperimentDefinitionLoaderService],
})
export class ExperimentDefinitionComponent {
  constructor(
    private experimentDefinitionLoaderService: ExperimentDefinitionLoaderService
  ) {}

  get experimentDefinition(): ExperimentDefinition | undefined {
    return this.experimentDefinitionLoaderService.experimentDefinition;
  }
}
