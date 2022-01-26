import { Component, OnInit, ViewChild } from '@angular/core';
import {
  RunningProcess,
  RunningProcessEntry,
  RunningProcessInit,
} from '../../development-process-registry/running-process/running-process';
import { RunningProcessService } from '../../development-process-registry/running-process/running-process.service';
import { BmProcessEntry } from '../../development-process-registry/bm-process/bm-process';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BmProcessService } from '../../development-process-registry/bm-process/bm-process.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ELEMENT_SERVICE, ListService } from '../../shared/list.service';

@Component({
  selector: 'app-running-processes',
  templateUrl: './running-processes.component.html',
  styleUrls: ['./running-processes.component.css'],
  providers: [
    ListService,
    { provide: ELEMENT_SERVICE, useExisting: RunningProcessService },
  ],
})
export class RunningProcessesComponent implements OnInit {
  addRunningProcessForm: FormGroup;
  processes: BmProcessEntry[] = [];

  modalRunningProcess: RunningProcess;
  private modalReference: NgbModalRef;

  @ViewChild('deleteProcessModal', { static: true })
  deleteProcessModal: unknown;

  constructor(
    private bmProcessService: BmProcessService,
    private fb: FormBuilder,
    private listService: ListService<RunningProcess, RunningProcessInit>,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    void this.loadProcesses();
    this.initForm();
  }

  initForm(): void {
    this.addRunningProcessForm = this.fb.group({
      name: ['', Validators.required],
      process: [null, Validators.required],
    });
  }

  async addRunningProcess(): Promise<void> {
    await this.listService.add({
      process: this.processControl.value,
      name: this.nameControl.value,
    });
    this.initForm();
  }

  async loadProcesses(): Promise<void> {
    this.processes = await this.bmProcessService.getList();
  }

  async openDeleteProcessModal(runningProcess: RunningProcess): Promise<void> {
    this.modalRunningProcess = runningProcess;
    this.modalReference = this.modalService.open(this.deleteProcessModal, {
      size: 'lg',
    });
  }

  async deleteRunningProcess(id: string): Promise<void> {
    await this.listService.delete(id);
  }

  get processControl(): FormControl {
    return this.addRunningProcessForm.get('process') as FormControl;
  }

  get nameControl(): FormControl {
    return this.addRunningProcessForm.get('name') as FormControl;
  }

  get runningProcessesList(): RunningProcessEntry[] {
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
