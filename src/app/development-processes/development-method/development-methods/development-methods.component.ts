import { Component } from '@angular/core';
import {
  DevelopmentMethodEntry,
  DevelopmentMethodInit,
} from '../../../development-process-registry/development-method/development-method';
import { DevelopmentMethodService } from '../../../development-process-registry/development-method/development-method.service';
import { ELEMENT_SERVICE, ListService } from '../../../shared/list.service';
import {
  defaultSearchFunction,
  SEARCH_FUNCTION,
  SearchService,
} from '../../../shared/search.service';
import { ListFilterService } from '../../../shared/list-filter.service';
import { FilterService } from '../../../shared/filter.service';

@Component({
  selector: 'app-development-methods',
  templateUrl: './development-methods.component.html',
  styleUrls: ['./development-methods.component.css'],
  providers: [
    FilterService,
    SearchService,
    { provide: SEARCH_FUNCTION, useValue: defaultSearchFunction },
    ListFilterService,
    { provide: ListService, useExisting: ListFilterService },
    { provide: ELEMENT_SERVICE, useExisting: DevelopmentMethodService },
  ],
})
export class DevelopmentMethodsComponent {
  get viewLinkFunction(): (item: DevelopmentMethodEntry) => string[] {
    return (item: DevelopmentMethodEntry) => [
      '/',
      'methods',
      'methodview',
      item._id,
    ];
  }

  get createFunction(): (name: string) => DevelopmentMethodInit {
    return (name: string) => {
      return {
        name: name,
        author: {},
      };
    };
  }
}
