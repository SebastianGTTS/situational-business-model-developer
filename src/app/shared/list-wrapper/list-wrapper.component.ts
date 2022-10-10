import { Component, Input, Optional } from '@angular/core';
import { SearchService } from '../search.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-list-wrapper',
  templateUrl: './list-wrapper.component.html',
  styleUrls: ['./list-wrapper.component.css'],
})
export class ListWrapperComponent<T> {
  @Input() listTitle!: string;
  @Input() loading = false;
  @Input() reloading = false;
  @Input() noResults = false;

  constructor(@Optional() private searchService?: SearchService<T>) {}

  get searchForm(): FormGroup | undefined {
    return this.searchService?.searchForm;
  }
}
