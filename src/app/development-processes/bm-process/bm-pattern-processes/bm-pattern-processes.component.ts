import { Component } from '@angular/core';
import { BmProcessEntry } from '../../../development-process-registry/bm-process/bm-process';
import { FilterService } from '../../../shared/filter.service';
import {
  defaultSearchFunction,
  SEARCH_FUNCTION,
  SearchService,
} from '../../../shared/search.service';
import { ListFilterService } from '../../../shared/list-filter.service';
import { ELEMENT_SERVICE, ListService } from '../../../shared/list.service';
import { BmPatternProcessService } from '../../../development-process-registry/bm-process/bm-pattern-process.service';
import { BmPatternProcessInit } from '../../../development-process-registry/bm-process/bm-pattern-process';

@Component({
  selector: 'app-bm-pattern-processes',
  templateUrl: './bm-pattern-processes.component.html',
  styleUrls: ['./bm-pattern-processes.component.scss'],
  providers: [
    FilterService,
    SearchService,
    { provide: SEARCH_FUNCTION, useValue: defaultSearchFunction },
    ListFilterService,
    { provide: ListService, useExisting: ListFilterService },
    { provide: ELEMENT_SERVICE, useExisting: BmPatternProcessService },
  ],
})
export class BmPatternProcessesComponent {
  constructor(private bmPatternProcessService: BmPatternProcessService) {}

  get viewLinkFunction(): (item: BmProcessEntry) => string[] {
    return (item: BmProcessEntry) => [
      '/',
      'bmprocess',
      'bmprocessview',
      item._id,
    ];
  }

  get createFunction(): (name: string) => Promise<BmPatternProcessInit> {
    return (name: string) =>
      this.bmPatternProcessService.getBmProcessInitialization(name);
  }
}
