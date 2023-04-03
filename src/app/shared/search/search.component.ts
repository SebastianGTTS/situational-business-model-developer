import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { SearchService } from '../search.service';
import { UntypedFormGroup } from '@angular/forms';
import { FilterService } from '../filter.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [FilterService, SearchService],
})
export class SearchComponent<T> implements OnChanges {
  @Input() heading!: string;
  @Input() itemName!: string;
  @Input() content!: TemplateRef<unknown>;
  @Input() items?: T[];

  constructor(
    private filterService: FilterService<T>,
    private searchService: SearchService<T>
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items) {
      this.searchForm.reset();
      this.filterService.items = changes.items.currentValue;
    }
  }

  get searchForm(): UntypedFormGroup {
    return this.searchService.searchForm;
  }

  get filteredResults(): T[] | undefined {
    return this.filterService.filteredResults;
  }
}
