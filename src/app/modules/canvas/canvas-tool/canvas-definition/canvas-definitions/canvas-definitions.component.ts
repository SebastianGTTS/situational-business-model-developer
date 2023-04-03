import { Component } from '@angular/core';
import {
  CanvasDefinitionEntry,
  CanvasDefinitionInit,
} from '../../../canvas-meta-artifact/canvas-definition';
import { CanvasDefinitionService } from '../../../canvas-meta-artifact/canvas-definition.service';
import {
  ELEMENT_SERVICE,
  ListService,
} from '../../../../../shared/list.service';
import {
  defaultSearchFunction,
  SEARCH_FUNCTION,
  SearchService,
} from '../../../../../shared/search.service';
import { ListFilterService } from '../../../../../shared/list-filter.service';
import { FilterService } from '../../../../../shared/filter.service';

@Component({
  selector: 'app-canvas-definitions',
  templateUrl: './canvas-definitions.component.html',
  styleUrls: ['./canvas-definitions.component.css'],
  providers: [
    FilterService,
    SearchService,
    { provide: SEARCH_FUNCTION, useValue: defaultSearchFunction },
    ListFilterService,
    { provide: ListService, useExisting: ListFilterService },
    { provide: ELEMENT_SERVICE, useExisting: CanvasDefinitionService },
  ],
})
export class CanvasDefinitionsComponent {
  get viewLinkFunction(): (item: CanvasDefinitionEntry) => string[] {
    return (item: CanvasDefinitionEntry) => [
      '/',
      'canvas',
      'definitions',
      item._id,
    ];
  }

  get createFunction(): (name: string) => CanvasDefinitionInit {
    return (name: string) => {
      return {
        name: name,
      };
    };
  }
}
