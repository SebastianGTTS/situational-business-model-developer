import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { SearchService } from '../search.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [SearchService],
})
export class SearchComponent<T> implements OnChanges {
  @Input() heading!: string;
  @Input() itemName!: string;
  @Input() content!: TemplateRef<unknown>;
  @Input() items?: T[];

  constructor(private searchService: SearchService<T>) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items) {
      this.searchForm.reset();
      this.searchService.items = changes.items.currentValue;
    }
  }

  get searchForm(): FormGroup {
    return this.searchService.searchForm;
  }

  get filteredResults(): T[] | undefined {
    return this.searchService.filteredResults;
  }
}
