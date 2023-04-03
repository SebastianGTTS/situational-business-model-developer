import { Component } from '@angular/core';
import { ExperimentRepoService } from '../../../hypo-mo-map-meta-artifact/experiment-repo.service';
import {
  ELEMENT_SERVICE,
  ListService,
} from '../../../../../shared/list.service';
import {
  SEARCH_FUNCTION,
  SearchService,
} from '../../../../../shared/search.service';
import {
  ExperimentDefinitionEntry,
  ExperimentDefinitionInit,
} from '../../../hypo-mo-map-meta-artifact/experiment-definition';
import { ListItem } from '../../../../../shared/list-item/list-item.component';
import { ListFilterService } from '../../../../../shared/list-filter.service';
import { FilterService } from '../../../../../shared/filter.service';

export function experimentSearchFunction(
  searchValue: string,
  item: ExperimentDefinitionEntry
): boolean {
  return item.experiment.name.toLowerCase().includes(searchValue);
}

@Component({
  selector: 'app-experiments',
  templateUrl: './experiments.component.html',
  styleUrls: ['./experiments.component.css'],
  providers: [
    FilterService,
    SearchService,
    { provide: SEARCH_FUNCTION, useValue: experimentSearchFunction },
    ListFilterService,
    { provide: ListService, useExisting: ListFilterService },
    { provide: ELEMENT_SERVICE, useExisting: ExperimentRepoService },
  ],
})
/**
 * Shows experiments defined in the experiment repository
 */
export class ExperimentsComponent {
  constructor(private experimentRepoService: ExperimentRepoService) {}

  get viewLinkFunction(): (item: ExperimentDefinitionEntry) => string[] {
    return (item: ExperimentDefinitionEntry) => [
      '/',
      'hypomomaps',
      'experiments',
      item._id,
    ];
  }

  get createFunction(): (name: string) => ExperimentDefinitionInit {
    return (name: string) =>
      this.experimentRepoService.getExperimentDefinitionInit(name);
  }

  get mapFunction(): (input: unknown) => ListItem {
    return (input: unknown) => {
      const item = input as ExperimentDefinitionEntry;
      return {
        name: item.experiment.name,
        description: item.experiment.description,
        icon: item.experiment.icon,
      };
    };
  }
}
