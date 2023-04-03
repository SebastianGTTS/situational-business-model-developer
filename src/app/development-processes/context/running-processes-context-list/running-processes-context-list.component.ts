import { Component, Input } from '@angular/core';
import { ELEMENT_SERVICE, ListService } from '../../../shared/list.service';
import { RunningProcessEntry } from '../../../development-process-registry/running-process/running-process';
import { RunningProcessContextTypesService } from '../../../development-process-registry/running-process/running-process-types.service';
import {
  defaultSearchFunction,
  SEARCH_FUNCTION,
  SearchService,
} from '../../../shared/search.service';
import { ListFilterService } from '../../../shared/list-filter.service';
import { FilterService } from '../../../shared/filter.service';

@Component({
  selector: 'app-running-processes-context-list',
  templateUrl: './running-processes-context-list.component.html',
  styleUrls: ['./running-processes-context-list.component.css'],
  providers: [
    FilterService,
    SearchService,
    { provide: SEARCH_FUNCTION, useValue: defaultSearchFunction },
    ListFilterService,
    { provide: ListService, useExisting: ListFilterService },
    {
      provide: ELEMENT_SERVICE,
      useExisting: RunningProcessContextTypesService,
    },
  ],
})
export class RunningProcessesContextListComponent {
  @Input() editable = false;

  get viewLinkFunction(): (item: RunningProcessEntry) => string[] {
    return (item: RunningProcessEntry) => [
      '/',
      'bmprocess',
      'contextchange',
      item._id,
    ];
  }
}
