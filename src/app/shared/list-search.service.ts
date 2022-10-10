import { Inject, Injectable } from '@angular/core';
import { ELEMENT_SERVICE, ListService } from './list.service';
import { DatabaseModel } from '../database/database-model';
import { DatabaseRootInit } from '../database/database-entry';
import { ElementService } from '../database/element.service';
import { SearchService } from './search.service';
import { EntryType } from '../database/database-model-part';

@Injectable()
export class ListSearchService<
  T extends DatabaseModel,
  S extends DatabaseRootInit
> extends ListService<T, S> {
  constructor(
    @Inject(ELEMENT_SERVICE) elementService: ElementService<T, S>,
    private searchService: SearchService<EntryType<T>>
  ) {
    super(elementService);
  }

  override async load(): Promise<void> {
    await super.load();
    this.searchService.items = this.elements;
  }

  get filteredElements(): EntryType<T>[] | undefined {
    return this.searchService.filteredResults;
  }

  get searchValue(): string | undefined {
    return this.searchService.searchForm.get('search')?.value;
  }
}
