import { Component } from '@angular/core';
import {
  SituationalFactorDefinitionEntry,
  SituationalFactorDefinitionInit,
} from '../../../../development-process-registry/method-elements/situational-factor/situational-factor-definition';
import {
  defaultSearchFunction,
  SEARCH_FUNCTION,
  SearchService,
} from '../../../../shared/search.service';
import { ELEMENT_SERVICE, ListService } from '../../../../shared/list.service';
import { MethodElementService } from '../../../../development-process-registry/method-elements/method-element.service';
import { SituationalFactorService } from '../../../../development-process-registry/method-elements/situational-factor/situational-factor.service';
import { ListFilterService } from '../../../../shared/list-filter.service';
import { FilterService } from '../../../../shared/filter.service';

@Component({
  selector: 'app-situational-factors',
  templateUrl: './situational-factors.component.html',
  styleUrls: ['./situational-factors.component.css'],
  providers: [
    FilterService,
    SearchService,
    { provide: SEARCH_FUNCTION, useValue: defaultSearchFunction },
    ListFilterService,
    { provide: ListService, useExisting: ListFilterService },
    { provide: ELEMENT_SERVICE, useExisting: SituationalFactorService },
    { provide: MethodElementService, useExisting: SituationalFactorService },
  ],
})
export class SituationalFactorsComponent {
  get viewLinkFunction(): (item: SituationalFactorDefinitionEntry) => string[] {
    return (item: SituationalFactorDefinitionEntry) => [
      '/',
      'situationalFactors',
      'detail',
      item._id,
    ];
  }

  get createFunction(): (
    name: string,
    list: string
  ) => SituationalFactorDefinitionInit {
    return (name: string, list: string) => {
      return {
        name: name,
        list: list,
      };
    };
  }
}
