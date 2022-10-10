import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TypeService } from '../../development-process-registry/method-elements/type/type.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TypeEntry } from '../../development-process-registry/method-elements/type/type';

@Component({
  selector: 'app-types',
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.css'],
})
export class TypesComponent implements OnInit {
  elementLists?: { listName: string; elements: TypeEntry[] }[];
  listNames: string[] = [];

  modalType?: TypeEntry;
  private modalReference?: NgbModalRef;

  @ViewChild('deleteTypeModal', { static: true }) deleteTypeModal: unknown;

  constructor(
    private modalService: NgbModal,
    private typeService: TypeService
  ) {}

  ngOnInit(): void {
    void this.load();
  }

  private async load(): Promise<void> {
    this.elementLists = await this.typeService.getLists();
    this.listNames = this.elementLists.map((list) => list.listName);
  }

  openDeleteTypeModal(type: TypeEntry): void {
    this.modalType = type;
    this.modalReference = this.modalService.open(this.deleteTypeModal, {
      size: 'lg',
    });
  }

  async delete(id: string): Promise<void> {
    await this.typeService.delete(id);
    await this.load();
  }

  async add(form: FormGroup): Promise<void> {
    await this.typeService.add(form.value);
    await this.load();
  }
}
