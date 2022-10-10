import { Injectable, OnDestroy } from '@angular/core';
import { SelectionEntry } from '../../development-process-registry/development-method/selection';
import {
  Type,
  TypeEntry,
} from '../../development-process-registry/method-elements/type/type';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { defaultSearchFunction } from '../../shared/search.service';

export interface SearchItem {
  name: string;
  types: SelectionEntry<TypeEntry>[];
}

interface SearchFormValue {
  search?: string;
  list?: string;
  element?: Type;
}

@Injectable()
export class SearchFilterTypeService<T extends SearchItem>
  implements OnDestroy
{
  searchForm: FormGroup = this.fb.group({
    search: [''],
    list: [''],
    element: [null],
  });

  private _items?: T[];
  set items(items: T[]) {
    this._items = items;
    this.searchFilter(this.searchForm.value.search);
  }

  private _filteredResults?: T[];
  get filteredResults(): T[] | undefined {
    return this._filteredResults;
  }

  private searchSubscription: Subscription;

  constructor(private fb: FormBuilder) {
    this.searchSubscription = this.searchForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe((value) => this.searchFilter(value));
  }

  private searchFilter(searchFormValue?: SearchFormValue): void {
    if (searchFormValue != null) {
      this._filteredResults = this._items?.filter(
        (item) =>
          this.search(item, searchFormValue.search) &&
          this.filterList(item, searchFormValue.list) &&
          this.filterType(item, searchFormValue.element)
      );
    } else {
      this._filteredResults = this._items;
    }
  }

  private search(item: T, value?: string): boolean {
    if (value != null) {
      const lowerValue = value.toLowerCase();
      return defaultSearchFunction(lowerValue, item);
    } else {
      return true;
    }
  }

  private filterList(item: T, listValue?: string): boolean {
    if (listValue != null && listValue != '') {
      return item.types.some((type) => type.list === listValue);
    } else {
      return true;
    }
  }

  private filterType(item: T, typeValue?: Type): boolean {
    if (typeValue != null) {
      return item.types.some(
        (type) => type.element != null && type.element._id === typeValue._id
      );
    } else {
      return true;
    }
  }

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
  }
}
