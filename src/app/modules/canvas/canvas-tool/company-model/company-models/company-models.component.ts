import { Component } from '@angular/core';
import { CompanyModelService } from '../../../canvas-meta-artifact/company-model.service';
import { CanvasDefinition } from '../../../canvas-meta-artifact/canvas-definition';
import {
  ELEMENT_SERVICE,
  ListService,
} from '../../../../../shared/list.service';
import {
  defaultSearchFunction,
  SEARCH_FUNCTION,
  SearchService,
} from '../../../../../shared/search.service';
import {
  CompanyModelEntry,
  CompanyModelInit,
} from '../../../canvas-meta-artifact/company-model';
import { ListFilterService } from '../../../../../shared/list-filter.service';
import { FilterService } from '../../../../../shared/filter.service';

@Component({
  selector: 'app-company-models',
  templateUrl: './company-models.component.html',
  styleUrls: ['./company-models.component.css'],
  providers: [
    FilterService,
    SearchService,
    { provide: SEARCH_FUNCTION, useValue: defaultSearchFunction },
    ListFilterService,
    { provide: ListService, useExisting: ListFilterService },
    { provide: ELEMENT_SERVICE, useExisting: CompanyModelService },
  ],
})
export class CompanyModelsComponent {
  constructor(private companyModelService: CompanyModelService) {}

  get viewLinkFunction(): (item: CompanyModelEntry) => string[] {
    return (item: CompanyModelEntry) => ['/', 'companyModels', item._id];
  }

  get createFunction(): (
    name: string,
    definition: CanvasDefinition
  ) => Promise<CompanyModelInit> {
    return async (name: string, definition: CanvasDefinition) =>
      this.companyModelService.createFeatureModel(
        { name, $definition: definition },
        definition
      );
  }
}
