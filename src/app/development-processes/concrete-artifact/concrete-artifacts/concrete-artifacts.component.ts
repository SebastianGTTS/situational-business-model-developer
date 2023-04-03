import { Component } from '@angular/core';
import { ConcreteArtifactService } from '../../../development-process-registry/running-process/concrete-artifact.service';
import { ELEMENT_SERVICE, ListService } from '../../../shared/list.service';
import {
  defaultSearchFunction,
  SEARCH_FUNCTION,
  SearchService,
} from '../../../shared/search.service';
import { RunningArtifactEntry } from '../../../development-process-registry/running-process/running-artifact';
import { ListFilterService } from '../../../shared/list-filter.service';
import { FilterService } from '../../../shared/filter.service';

@Component({
  selector: 'app-concrete-artifacts',
  templateUrl: './concrete-artifacts.component.html',
  styleUrls: ['./concrete-artifacts.component.css'],
  providers: [
    FilterService,
    SearchService,
    { provide: SEARCH_FUNCTION, useValue: defaultSearchFunction },
    ListFilterService,
    { provide: ListService, useExisting: ListFilterService },
    { provide: ELEMENT_SERVICE, useExisting: ConcreteArtifactService },
  ],
})
export class ConcreteArtifactsComponent {
  get viewLinkFunction(): (item: RunningArtifactEntry) => string[] {
    return (item: RunningArtifactEntry) => [
      '/',
      'concreteArtifacts',
      'detail',
      item._id,
    ];
  }
}
