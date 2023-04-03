import { Component, Input, ViewChild } from '@angular/core';
import {
  MethodElement,
  MethodElementInit,
} from '../../../development-process-registry/method-elements/method-element';
import { EntryType } from '../../../database/database-model-part';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DbId } from '../../../database/database-entry';
import { SearchService } from '../../../shared/search.service';
import { ListFilterService } from '../../../shared/list-filter.service';

@Component({
  selector: 'app-method-element-list',
  templateUrl: './method-element-list.component.html',
  styleUrls: ['./method-element-list.component.css'],
})
export class MethodElementListComponent<
  T extends MethodElement,
  S extends MethodElementInit
> {
  @Input() elementName!: string;
  @Input() elementNamePlural!: string;
  @Input() viewLinkFunction!: (item: EntryType<T>) => string[];

  pageSizeForm = this.fb.nonNullable.group({
    pageSize: 10,
  });

  modalItem?: EntryType<T>;
  private modalReference?: NgbModalRef;

  @ViewChild('deleteItemModal', { static: true }) deleteItemModal: unknown;

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

  get loading(): boolean {
    return this.listService.loading;
  }

  get reloading(): boolean {
    return this.listService.reloading;
  }

  get size(): number {
    return this.listService.filteredElements?.length ?? 0;
  }

  get pageSize(): number {
    return this.pageSizeForm.getRawValue().pageSize;
  }

  get filteredItems(): EntryType<T>[] {
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
