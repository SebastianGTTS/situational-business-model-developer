import { Component } from '@angular/core';
import { ELEMENT_SERVICE, ListService } from '../../../../shared/list.service';
import {
  WhiteboardTemplateEntry,
  WhiteboardTemplateInit,
} from '../../whiteboard-meta-artifact/whiteboard-template';
import { WhiteboardTemplateService } from '../../whiteboard-meta-artifact/whiteboard-template.service';
import {
  defaultSearchFunction,
  SEARCH_FUNCTION,
  SearchService,
} from '../../../../shared/search.service';
import { ListFilterService } from '../../../../shared/list-filter.service';
import { FilterService } from '../../../../shared/filter.service';

@Component({
  selector: 'app-whiteboard-templates',
  templateUrl: './whiteboard-templates.component.html',
  styleUrls: ['./whiteboard-templates.component.css'],
  providers: [
    FilterService,
    SearchService,
    { provide: SEARCH_FUNCTION, useValue: defaultSearchFunction },
    ListFilterService,
    { provide: ListService, useExisting: ListFilterService },
    { provide: ELEMENT_SERVICE, useExisting: WhiteboardTemplateService },
  ],
})
export class WhiteboardTemplatesComponent {
  constructor(private whiteboardTemplateService: WhiteboardTemplateService) {}

  get viewLinkFunction(): (item: WhiteboardTemplateEntry) => string[] {
    return (item: WhiteboardTemplateEntry) => [
      '/',
      'whiteboard',
      'templates',
      item._id,
    ];
  }

  get createFunction(): (name: string) => WhiteboardTemplateInit {
    return (name) =>
      this.whiteboardTemplateService.getWhiteboardTemplateInitialization(name);
  }
}
