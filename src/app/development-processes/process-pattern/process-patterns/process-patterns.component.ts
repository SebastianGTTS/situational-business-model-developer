import { Component } from '@angular/core';
import { ProcessPatternService } from '../../../development-process-registry/process-pattern/process-pattern.service';
import { ELEMENT_SERVICE, ListService } from '../../../shared/list.service';
import {
  defaultSearchFunction,
  SEARCH_FUNCTION,
  SearchService,
} from '../../../shared/search.service';
import {
  ProcessPatternEntry,
  ProcessPatternInit,
} from '../../../development-process-registry/process-pattern/process-pattern';
import { ProcessPatternDiagramService } from '../../../development-process-registry/process-pattern/process-pattern-diagram.service';
import { ListFilterService } from '../../../shared/list-filter.service';
import { FilterService } from '../../../shared/filter.service';

@Component({
  selector: 'app-process-patterns',
  templateUrl: './process-patterns.component.html',
  styleUrls: ['./process-patterns.component.css'],
  providers: [
    FilterService,
    SearchService,
    { provide: SEARCH_FUNCTION, useValue: defaultSearchFunction },
    ListFilterService,
    { provide: ListService, useExisting: ListFilterService },
    { provide: ELEMENT_SERVICE, useExisting: ProcessPatternService },
  ],
})
export class ProcessPatternsComponent {
  constructor(
    private processPatternDiagramService: ProcessPatternDiagramService
  ) {}

  get viewLinkFunction(): (item: ProcessPatternEntry) => string[] {
    return (item: ProcessPatternEntry) => [
      '/',
      'process',
      'processview',
      item._id,
    ];
  }

  get createFunction(): (name: string) => Promise<ProcessPatternInit> {
    return async (name: string) => {
      return {
        name: name,
        author: {},
        pattern:
          await this.processPatternDiagramService.getEmptyProcessPatternDiagram(),
      };
    };
  }
}
