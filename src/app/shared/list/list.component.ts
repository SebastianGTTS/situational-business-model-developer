import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DatabaseModel } from '../../database/database-model';
import { DatabaseInit, DbId } from '../../database/database-entry';
import { SearchService } from '../search.service';
import { EntryType } from '../../database/database-model-part';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ListItem } from '../list-item/list-item.component';
import { ListFilterService } from '../list-filter.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent<T extends DatabaseModel, S extends DatabaseInit> {
  @Input() showView = true;
  @Input() showDelete = true;

  @Input() elementName!: string;
  @Input() elementNamePlural!: string;
  @Input() viewLinkFunction!: (item: EntryType<T>) => string[];
  @Input() mapFunction?: (item: unknown) => ListItem;

  pageSizeForm = this.fb.nonNullable.group({
    pageSize: 10,
  });

  modalItem?: EntryType<T>;
  private modalReference?: NgbModalRef;

  @ViewChild('deleteItemModal', { static: true })
  deleteItemModal: unknown;

  page = 0;

  constructor(
    private fb: FormBuilder,
    private listService: ListFilterService<T, S>,
    private modalService: NgbModal,
    private searchService: SearchService<EntryType<T>>
  ) {}

  openDeleteItemModal(item: EntryType<T>): void {
    this.modalItem = item;
    this.modalReference = this.modalService.open(this.deleteItemModal, {
      size: 'lg',
    });
  }

  async delete(item: EntryType<T>): Promise<void> {
    await this.listService.delete(item._id);
  }

  get size(): number {
    return this.listService.filteredElements?.length ?? 0;
  }

  get pageSize(): number {
    return this.pageSizeForm.getRawValue().pageSize;
  }

  get filteredItems(): (EntryType<T> & {
    name: string;
    description: string;
  })[] {
    return this.listService.filteredElements as (EntryType<T> & {
      name: string;
      description: string;
    })[];
  }

  get searchForm(): FormGroup<{ search: FormControl<string> }> {
    return this.searchService.searchForm;
  }

  get searchValue(): string | undefined {
    return this.searchService.searchValue;
  }

  get filtering(): boolean {
    return this.listService.filtering;
  }

  get noResults(): boolean {
    return this.listService.noResults;
  }

  trackBy(index: number, item: EntryType<T>): DbId {
    return item._id;
  }
}
