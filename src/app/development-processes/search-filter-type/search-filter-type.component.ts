import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  SearchFilterTypeService,
  SearchItem,
} from './search-filter-type.service';
import { TypeEntry } from '../../development-process-registry/method-elements/type/type';
import { TypeService } from '../../development-process-registry/method-elements/type/type.service';

@Component({
  selector: 'app-search-filter-type',
  templateUrl: './search-filter-type.component.html',
  styleUrls: ['./search-filter-type.component.css'],
  providers: [SearchFilterTypeService],
})
export class SearchFilterTypeComponent<T extends SearchItem>
  implements OnInit, OnChanges
{
  @Input() heading!: string;
  @Input() itemName!: string;
  @Input() content!: TemplateRef<unknown>;
  @Input() items?: T[];

  types: TypeEntry[] = [];
  typeLists: string[] = [];

  constructor(
    private searchFilterTypeService: SearchFilterTypeService<T>,
    private typeService: TypeService
  ) {}

  ngOnInit(): void {
    void this.loadTypes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items) {
      this.searchForm.reset();
      this.searchFilterTypeService.items = changes.items.currentValue;
    }
  }

  get searchForm(): FormGroup {
    return this.searchFilterTypeService.searchForm;
  }

  get filteredResults(): T[] | undefined {
    return this.searchFilterTypeService.filteredResults;
  }

  private async loadTypes(): Promise<void> {
    this.types = await this.typeService.getList();
    this.typeLists = [...new Set(this.types.map((element) => element.list))];
  }
}
