import { Component } from '@angular/core';
import { DomainService } from '../../../../development-process-registry/knowledge/domain.service';
import { DomainInit } from '../../../../development-process-registry/knowledge/domain';
import { ELEMENT_SERVICE, ListService } from '../../../../shared/list.service';
import {
  defaultSearchFunction,
  SEARCH_FUNCTION,
  SearchService,
} from '../../../../shared/search.service';
import { DevelopmentMethodEntry } from '../../../../development-process-registry/development-method/development-method';
import { ListFilterService } from '../../../../shared/list-filter.service';
import { FilterService } from '../../../../shared/filter.service';

@Component({
  selector: 'app-domains',
  templateUrl: './domains.component.html',
  styleUrls: ['./domains.component.css'],
  providers: [
    FilterService,
    SearchService,
    { provide: SEARCH_FUNCTION, useValue: defaultSearchFunction },
    ListFilterService,
    { provide: ListService, useExisting: ListFilterService },
    { provide: ELEMENT_SERVICE, useExisting: DomainService },
  ],
})
export class DomainsComponent {
  get viewLinkFunction(): (item: DevelopmentMethodEntry) => string[] {
    return (item: DevelopmentMethodEntry) => [
      '/',
      'domains',
      'detail',
      item._id,
    ];
  }

  get createFunction(): (name: string) => DomainInit {
    return (name: string) => {
      return {
        name: name,
      };
    };
  }
}
