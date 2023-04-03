import { Component } from '@angular/core';
import { ArtifactService } from '../../../../development-process-registry/method-elements/artifact/artifact.service';
import {
  ArtifactEntry,
  ArtifactInit,
} from '../../../../development-process-registry/method-elements/artifact/artifact';
import {
  defaultSearchFunction,
  SEARCH_FUNCTION,
  SearchService,
} from '../../../../shared/search.service';
import { ELEMENT_SERVICE, ListService } from '../../../../shared/list.service';
import { MethodElementService } from '../../../../development-process-registry/method-elements/method-element.service';
import { ListFilterService } from '../../../../shared/list-filter.service';
import { FilterService } from '../../../../shared/filter.service';

@Component({
  selector: 'app-artifacts',
  templateUrl: './artifacts.component.html',
  styleUrls: ['./artifacts.component.css'],
  providers: [
    FilterService,
    SearchService,
    { provide: SEARCH_FUNCTION, useValue: defaultSearchFunction },
    ListFilterService,
    { provide: ListService, useExisting: ListFilterService },
    { provide: ELEMENT_SERVICE, useExisting: ArtifactService },
    { provide: MethodElementService, useExisting: ArtifactService },
  ],
})
export class ArtifactsComponent {
  get viewLinkFunction(): (item: ArtifactEntry) => string[] {
    return (item: ArtifactEntry) => ['/', 'artifacts', 'detail', item._id];
  }

  get createFunction(): (name: string, list: string) => ArtifactInit {
    return (name: string, list: string) => {
      return {
        name: name,
        list: list,
      };
    };
  }
}
