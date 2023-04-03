import { Component } from '@angular/core';
import { ExpertModelService } from '../../../canvas-meta-artifact/expert-model.service';
import {
  ExpertModel,
  ExpertModelEntry,
  ExpertModelInit,
} from '../../../canvas-meta-artifact/expert-model';
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
import { ListFilterService } from '../../../../../shared/list-filter.service';
import { FilterService } from '../../../../../shared/filter.service';

@Component({
  selector: 'app-expert-models',
  templateUrl: './expert-models.component.html',
  styleUrls: ['./expert-models.component.css'],
  providers: [
    FilterService,
    SearchService,
    { provide: SEARCH_FUNCTION, useValue: defaultSearchFunction },
    ListFilterService,
    { provide: ListService, useExisting: ListFilterService },
    { provide: ELEMENT_SERVICE, useExisting: ExpertModelService },
  ],
})
export class ExpertModelsComponent {
  constructor(
    private expertModelService: ExpertModelService,
    private listService: ListService<ExpertModel, ExpertModelInit>
  ) {}

  async reload(): Promise<void> {
    await this.listService.load();
  }

  get viewLinkFunction(): (item: ExpertModelEntry) => string[] {
    return (item: ExpertModelEntry) => ['/', 'expertModels', item._id];
  }

  get createFunction(): (
    name: string,
    definition: CanvasDefinition
  ) => Promise<ExpertModelInit> {
    return async (name: string, definition: CanvasDefinition) =>
      this.expertModelService.createFeatureModel(
        { name, $definition: definition },
        definition
      );
  }
}
