import { Component, Input } from '@angular/core';
import { RunningProcessEntry } from '../../../development-process-registry/running-process/running-process';
import { FilterService } from '../../../shared/filter.service';
import {
  defaultSearchFunction,
  SEARCH_FUNCTION,
  SearchService,
} from '../../../shared/search.service';
import { ListFilterService } from '../../../shared/list-filter.service';
import { ELEMENT_SERVICE, ListService } from '../../../shared/list.service';
import { RunningPatternProcessContextService } from '../../../development-process-registry/running-process/running-pattern-process-context.service';

@Component({
  selector: 'app-running-pattern-processes-context-list',
  templateUrl: './running-pattern-processes-context-list.component.html',
  styleUrls: ['./running-pattern-processes-context-list.component.scss'],
  providers: [
    FilterService,
    SearchService,
    { provide: SEARCH_FUNCTION, useValue: defaultSearchFunction },
    ListFilterService,
    { provide: ListService, useExisting: ListFilterService },
    {
      provide: ELEMENT_SERVICE,
      useExisting: RunningPatternProcessContextService,
    },
  ],
})
export class RunningPatternProcessesContextListComponent {
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
