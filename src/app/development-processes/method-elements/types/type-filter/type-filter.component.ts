import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FilterService } from '../../../../shared/filter.service';
import { SelectionEntry } from '../../../../development-process-registry/development-method/selection';
import { TypeEntry } from '../../../../development-process-registry/method-elements/type/type';
import { TypeService } from '../../../../development-process-registry/method-elements/type/type.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-type-filter',
  templateUrl: './type-filter.component.html',
  styleUrls: ['./type-filter.component.scss'],
})
export class TypeFilterComponent<
  T extends { types: SelectionEntry<TypeEntry>[] }
> implements OnInit, OnDestroy
{
  private static readonly filterListId = 'type-list';
  private static readonly filterTypeId = 'type';

  /**
   * Whether the internal types 'initialisation' and 'generic' should be
   * displayed in auto complete.
   */
  @Input() internalTypes = false;

  /** check for initialisation type list */

  form = this.fb.group({
    list: this.fb.nonNullable.control<string>(''),
    element: this.fb.control<TypeEntry | null>(null),
  });
  private formChangeSubscription?: Subscription;

  types: TypeEntry[] = [];
  typeLists: string[] = [];

  constructor(
    private fb: FormBuilder,
    private filterService: FilterService<T>,
    private typeService: TypeService
  ) {}

  ngOnInit(): void {
    this.formChangeSubscription = this.form.valueChanges.subscribe((value) => {
      if (value.list != null && value.list !== '') {
        const selectedList = value.list;
        this.filterService.addFilterFunction(
          TypeFilterComponent.filterListId,
          (item) => item.types?.some((type) => type.list === selectedList)
        );
      } else {
        this.filterService.removeFilterFunction(
          TypeFilterComponent.filterListId
        );
      }
      if (value.element != null) {
        const selectedElement = value.element;
        this.filterService.addFilterFunction(
          TypeFilterComponent.filterTypeId,
          (item) =>
            item.types?.some(
              (type) => type.element?._id === selectedElement._id
            )
        );
      } else {
        this.filterService.removeFilterFunction(
          TypeFilterComponent.filterTypeId
        );
      }
    });
    void this.loadTypes();
  }

  ngOnDestroy(): void {
    this.formChangeSubscription?.unsubscribe();
    this.filterService.removeFilterFunction(TypeFilterComponent.filterListId);
    this.filterService.removeFilterFunction(TypeFilterComponent.filterTypeId);
  }

  private async loadTypes(): Promise<void> {
    this.types = await this.typeService.getList();
    this.typeLists = [...new Set(this.types.map((element) => element.list))];
    if (this.internalTypes) {
      this.typeLists.push('initialisation', 'generic');
    }
  }
}
