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
import { RunningPhaseProcessContextService } from '../../../development-process-registry/running-process/running-phase-process-context.service';

@Component({
  selector: 'app-running-phase-processes-context-list',
  templateUrl: './running-phase-processes-context-list.component.html',
  styleUrls: ['./running-phase-processes-context-list.component.scss'],
  providers: [
    FilterService,
    SearchService,
    { provide: SEARCH_FUNCTION, useValue: defaultSearchFunction },
    ListFilterService,
    { provide: ListService, useExisting: ListFilterService },
    {
      provide: ELEMENT_SERVICE,
      useExisting: RunningPhaseProcessContextService,
    },
  ],
})
export class RunningPhaseProcessesContextListComponent {
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
