import { Inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { FilterFunction, FilterService } from './filter.service';

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
  private static readonly filterId = 'search';

  searchForm = this.fb.nonNullable.group({
    search: '',
  });

  private searchSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private filterService: FilterService<T>,
    @Inject(SEARCH_FUNCTION) private searchFunction: SearchFunction<T>
  ) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.searchSubscription = this.searchForm
      .get('search')!
      .valueChanges.pipe(
        tap(() => this.filterService.preAnnounceFiltering()),
        debounceTime(300)
      )
      .subscribe((value) => this.search(value));
  }

  private search(value?: string): void {
    if (value != null) {
      let searchValue = value;
      searchValue = searchValue.toLowerCase();
      const filterFunction: FilterFunction<T> = (item) =>
        this.searchFunction(searchValue, item);
      this.filterService.addFilterFunction(
        SearchService.filterId,
        filterFunction
      );
    } else {
      this.filterService.removeFilterFunction(SearchService.filterId);
    }
  }

  get searchValue(): string | undefined {
    return this.searchForm.get('search')?.value;
  }

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
    this.filterService.removeFilterFunction(SearchService.filterId);
  }
}
