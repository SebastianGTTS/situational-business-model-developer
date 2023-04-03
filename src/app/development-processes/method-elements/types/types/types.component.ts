import { Component } from '@angular/core';
import { TypeService } from '../../../../development-process-registry/method-elements/type/type.service';
import {
  TypeEntry,
  TypeInit,
} from '../../../../development-process-registry/method-elements/type/type';
import {
  defaultSearchFunction,
  SEARCH_FUNCTION,
  SearchService,
} from '../../../../shared/search.service';
import { ELEMENT_SERVICE, ListService } from '../../../../shared/list.service';
import { MethodElementService } from '../../../../development-process-registry/method-elements/method-element.service';
import { ListFilterService } from '../../../../shared/list-filter.service';
import { FilterService } from '../../../../shared/filter.service';

@Component({
  selector: 'app-types',
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.css'],
  providers: [
    FilterService,
    SearchService,
    { provide: SEARCH_FUNCTION, useValue: defaultSearchFunction },
    ListFilterService,
    { provide: ListService, useExisting: ListFilterService },
    { provide: ELEMENT_SERVICE, useExisting: TypeService },
    { provide: MethodElementService, useExisting: TypeService },
  ],
})
export class TypesComponent {
  get viewLinkFunction(): (item: TypeEntry) => string[] {
    return (item: TypeEntry) => ['/', 'types', 'detail', item._id];
  }

  get createFunction(): (name: string, list: string) => TypeInit {
    return (name: string, list: string) => {
      return {
        name: name,
        list: list,
      };
    };
  }
}
