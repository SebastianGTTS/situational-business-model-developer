import { Inject, Injectable } from '@angular/core';
import { ELEMENT_SERVICE, ListService } from './list.service';
import { ElementService } from '../database/element.service';
import { EntryType } from '../database/database-model-part';
import { DatabaseModel } from '../database/database-model';
import { DatabaseRootInit } from '../database/database-entry';
import { FilterService } from './filter.service';

@Injectable()
export class ListFilterService<
  T extends DatabaseModel,
  S extends DatabaseRootInit
> extends ListService<T, S> {
  constructor(
    @Inject(ELEMENT_SERVICE) elementService: ElementService<T, S>,
    private filterService: FilterService<EntryType<T>>
  ) {
    super(elementService);
  }

  override async load(): Promise<void> {
    await super.load();
    this.filterService.items = this.elements;
  }

  get filteredElements(): EntryType<T>[] | undefined {
    return this.filterService.filteredResults;
  }

  get filtering(): boolean {
    return this.filterService.filtering;
  }
}
