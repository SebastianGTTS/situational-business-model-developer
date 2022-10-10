import { Inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

type SearchFunction<T> = (searchValue: string, item: T) => boolean;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SEARCH_FUNCTION = new InjectionToken<SearchFunction<any>>(
  'Search function'
);

export function defaultSearchFunction<T extends { name: string }>(
  searchValue: string,
  item: T
): boolean {
  return item.name.toLowerCase().includes(searchValue);
}

@Injectable()
export class SearchService<T> implements OnDestroy {
  searchForm: FormGroup = this.fb.group({
    search: [''],
  });

  private _items?: T[];
  set items(items: T[] | undefined) {
    this._items = items;
    this.search(this.searchForm.value.search);
  }

  private _filteredResults?: T[];
  get filteredResults(): T[] | undefined {
    return this._filteredResults;
  }

  private searchSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    @Inject(SEARCH_FUNCTION) private searchFunction: SearchFunction<T>
  ) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.searchSubscription = this.searchForm
      .get('search')!
      .valueChanges.pipe(debounceTime(300))
      .subscribe((value) => this.search(value));
  }

  private search(value?: string): void {
    if (value != null) {
      value = value.toLowerCase();
      this._filteredResults = this._items?.filter((item) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.searchFunction(value!, item)
      );
    } else {
      this._filteredResults = this._items;
    }
  }

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
  }
}
