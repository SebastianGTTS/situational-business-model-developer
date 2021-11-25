import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [SearchService],
})
export class SearchComponent<T> implements OnChanges {
  @Input() heading: string;
  @Input() itemName: string;
  @Input() content: TemplateRef<any>;
  @Input() items: T[];

  constructor(private searchService: SearchService<T>) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.items) {
      this.searchForm.reset();
      this.searchService.items = changes.items.currentValue;
    }
  }

  get searchForm() {
    return this.searchService.searchForm;
  }

  get filteredResults() {
    return this.searchService.filteredResults;
  }
}
