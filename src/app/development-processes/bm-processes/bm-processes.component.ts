import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BmProcess,
  BmProcessEntry,
  BmProcessInit,
} from '../../development-process-registry/bm-process/bm-process';
import { BmProcessService } from '../../development-process-registry/bm-process/bm-process.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ELEMENT_SERVICE, ListService } from '../../shared/list.service';

@Component({
  selector: 'app-bm-processes',
  templateUrl: './bm-processes.component.html',
  styleUrls: ['./bm-processes.component.css'],
  providers: [
    ListService,
    { provide: ELEMENT_SERVICE, useExisting: BmProcessService },
  ],
})
export class BmProcessesComponent {
  bmProcessForm = this.fb.group({
    name: this.fb.control('', Validators.required),
  });

  modalBmProcess: BmProcessEntry;
  private modalReference: NgbModalRef;

  @ViewChild('deleteBmProcessModal', { static: true })
  deleteBmProcessModal: unknown;

  constructor(
    private fb: FormBuilder,
    private listService: ListService<BmProcess, BmProcessInit>,
    private modalService: NgbModal
  ) {}

  openDeleteBmProcessModal(bmProcess: BmProcessEntry): void {
    this.modalBmProcess = bmProcess;
    this.modalReference = this.modalService.open(this.deleteBmProcessModal, {
      size: 'lg',
    });
  }

  async deleteBmProcess(id: string): Promise<void> {
    await this.listService.delete(id);
  }

  async addBmProcess(bmProcessForm: FormGroup): Promise<void> {
    await this.listService.add({ name: bmProcessForm.value.name });
    this.bmProcessForm.reset();
  }

  get bmProcessesList(): BmProcessEntry[] {
    return this.listService.elements;
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
