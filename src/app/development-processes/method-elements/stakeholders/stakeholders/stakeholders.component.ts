import { Component } from '@angular/core';
import { StakeholderService } from '../../../../development-process-registry/method-elements/stakeholder/stakeholder.service';
import {
  StakeholderEntry,
  StakeholderInit,
} from '../../../../development-process-registry/method-elements/stakeholder/stakeholder';
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
  selector: 'app-stakeholders',
  templateUrl: './stakeholders.component.html',
  styleUrls: ['./stakeholders.component.css'],
  providers: [
    FilterService,
    SearchService,
    { provide: SEARCH_FUNCTION, useValue: defaultSearchFunction },
    ListFilterService,
    { provide: ListService, useExisting: ListFilterService },
    { provide: ELEMENT_SERVICE, useExisting: StakeholderService },
    { provide: MethodElementService, useExisting: StakeholderService },
  ],
})
export class StakeholdersComponent {
  get viewLinkFunction(): (item: StakeholderEntry) => string[] {
    return (item: StakeholderEntry) => [
      '/',
      'stakeholders',
      'detail',
      item._id,
    ];
  }

  get createFunction(): (name: string, list: string) => StakeholderInit {
    return (name: string, list: string) => {
      return {
        name: name,
        list: list,
      };
    };
  }
}
