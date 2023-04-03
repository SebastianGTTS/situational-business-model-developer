import { Component } from '@angular/core';
import {
  BmProcessEntry,
  BmProcessInit,
} from '../../../development-process-registry/bm-process/bm-process';
import { FilterService } from '../../../shared/filter.service';
import {
  defaultSearchFunction,
  SEARCH_FUNCTION,
  SearchService,
} from '../../../shared/search.service';
import { ListFilterService } from '../../../shared/list-filter.service';
import { ELEMENT_SERVICE, ListService } from '../../../shared/list.service';
import { BmPhaseProcessService } from '../../../development-process-registry/bm-process/bm-phase-process.service';

@Component({
  selector: 'app-bm-phase-processes',
  templateUrl: './bm-phase-processes.component.html',
  styleUrls: ['./bm-phase-processes.component.scss'],
  providers: [
    FilterService,
    SearchService,
    { provide: SEARCH_FUNCTION, useValue: defaultSearchFunction },
    ListFilterService,
    { provide: ListService, useExisting: ListFilterService },
    { provide: ELEMENT_SERVICE, useExisting: BmPhaseProcessService },
  ],
})
export class BmPhaseProcessesComponent {
  get viewLinkFunction(): (item: BmProcessEntry) => string[] {
    return (item: BmProcessEntry) => [
      '/',
      'bmprocess',
      'bmprocessview',
      item._id,
    ];
  }

  get createFunction(): (name: string) => BmProcessInit {
    return (name: string) => {
      return {
        name: name,
        author: {},
      };
    };
  }
}
