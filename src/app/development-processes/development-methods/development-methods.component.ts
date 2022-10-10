import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  DevelopmentMethod,
  DevelopmentMethodEntry,
  DevelopmentMethodInit,
} from '../../development-process-registry/development-method/development-method';
import { DevelopmentMethodService } from '../../development-process-registry/development-method/development-method.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ELEMENT_SERVICE } from '../../shared/list.service';
import {
  defaultSearchFunction,
  SEARCH_FUNCTION,
  SearchService,
} from '../../shared/search.service';
import { ListSearchService } from '../../shared/list-search.service';

@Component({
  selector: 'app-development-methods',
  templateUrl: './development-methods.component.html',
  styleUrls: ['./development-methods.component.css'],
  providers: [
    SearchService,
    { provide: SEARCH_FUNCTION, useValue: defaultSearchFunction },
    ListSearchService,
    { provide: ELEMENT_SERVICE, useExisting: DevelopmentMethodService },
  ],
})
export class DevelopmentMethodsComponent {
  developmentMethodForm = this.fb.group({
    name: this.fb.control('', Validators.required),
  });

  modalDevelopmentMethod?: DevelopmentMethodEntry;
  private modalReference?: NgbModalRef;

  @ViewChild('deleteDevelopmentMethodModal', { static: true })
  deleteDevelopmentMethodModal: unknown;

  constructor(
    private listService: ListSearchService<
      DevelopmentMethod,
      DevelopmentMethodInit
    >,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {}

  openDeleteDevelopmentMethodModal(
    developmentMethod: DevelopmentMethodEntry
  ): void {
    this.modalDevelopmentMethod = developmentMethod;
    this.modalReference = this.modalService.open(
      this.deleteDevelopmentMethodModal,
      {
        size: 'lg',
      }
    );
  }

  async deleteDevelopmentMethod(id: string): Promise<void> {
    await this.listService.delete(id);
  }

  async addDevelopmentMethod(developmentMethodForm: FormGroup): Promise<void> {
    await this.listService.add({
      name: developmentMethodForm.value.name,
      author: {},
    });
    this.developmentMethodForm.reset();
  }

  get developmentMethodsList(): DevelopmentMethodEntry[] | undefined {
    return this.listService.elements;
  }

  get developmentMethodsListFiltered(): DevelopmentMethodEntry[] | undefined {
    return this.listService.filteredElements;
  }

  get searchValue(): string | undefined {
    return this.listService.searchValue;
  }

  get noResults(): boolean {
    return this.listService.noResults;
  }

  get loading(): boolean {
    return this.listService.loading;
  }

  get reloading(): boolean {
    return this.listService.reloading;
  }
}
