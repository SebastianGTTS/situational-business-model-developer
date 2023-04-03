import { Injectable } from '@angular/core';

export type FilterFunction<T> = (item: T) => boolean;

@Injectable()
export class FilterService<T> {
  private _filtering = false;
  get filtering(): boolean {
    return this._filtering;
  }

  private filterFunctions: { [id: string]: FilterFunction<T> } = {};

  private _items?: T[];
  set items(items: T[] | undefined) {
    this._items = items;
    this._filtering = true;
    this.filter();
  }

  private _filteredResults?: T[];
  get filteredResults(): T[] | undefined {
    return this._filteredResults;
  }

  private filter(): void {
    const filterFunctions: FilterFunction<T>[] = Object.values(
      this.filterFunctions
    );
    this._filteredResults = this._items?.filter((item) =>
      filterFunctions.every((f) => f(item))
    );
    this._filtering = false;
  }

  addFilterFunction(id: string, filter: FilterFunction<T>): void {
    this.filterFunctions[id] = filter;
    this._filtering = true;
    this.filter();
  }

  removeFilterFunction(id: string): void {
    delete this.filterFunctions[id];
    this._filtering = true;
    this.filter();
  }

  preAnnounceFiltering(): void {
    this._filtering = true;
  }
}
