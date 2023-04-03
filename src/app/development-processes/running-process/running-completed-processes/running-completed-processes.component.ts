import { Component } from '@angular/core';
import { RunningProcessEntry } from '../../../development-process-registry/running-process/running-process';
import { FilterService } from '../../../shared/filter.service';
import {
  defaultSearchFunction,
  SEARCH_FUNCTION,
  SearchService,
} from '../../../shared/search.service';
import { ListFilterService } from '../../../shared/list-filter.service';
import { ELEMENT_SERVICE, ListService } from '../../../shared/list.service';
import { RunningCompletedProcessService } from '../../../development-process-registry/running-process/running-completed-process.service';

@Component({
  selector: 'app-running-completed-processes',
  templateUrl: './running-completed-processes.component.html',
  styleUrls: ['./running-completed-processes.component.scss'],
  providers: [
    FilterService,
    SearchService,
    { provide: SEARCH_FUNCTION, useValue: defaultSearchFunction },
    ListFilterService,
    { provide: ListService, useExisting: ListFilterService },
    {
      provide: ELEMENT_SERVICE,
      useExisting: RunningCompletedProcessService,
    },
  ],
})
export class RunningCompletedProcessesComponent {
  get viewLinkFunction(): (item: RunningProcessEntry) => string[] {
    return (item: RunningProcessEntry) => [
      '/',
      'runningprocess',
      'runningprocessview',
      item._id,
    ];
  }
}
