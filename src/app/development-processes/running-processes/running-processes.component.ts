import { Component, OnInit, ViewChild } from '@angular/core';
import {
  RunningProcess,
  RunningProcessEntry,
  RunningProcessInit,
} from '../../development-process-registry/running-process/running-process';
import { RunningProcessService } from '../../development-process-registry/running-process/running-process.service';
import {
  BmProcess,
  BmProcessEntry,
} from '../../development-process-registry/bm-process/bm-process';
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
  addRunningProcessForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    process: [null],
  });
  processes: BmProcessEntry[] = [];

  modalBmProcess?: BmProcess;
  modalRunningProcess?: RunningProcessEntry;
  private modalReference?: NgbModalRef;

  @ViewChild('deleteProcessModal', { static: true })
  deleteProcessModal: unknown;
  @ViewChild('errorProcessModal', { static: true })
  errorProcessModal: unknown;

  constructor(
    private bmProcessService: BmProcessService,
    private fb: FormBuilder,
    private listService: ListService<RunningProcess, RunningProcessInit>,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    void this.loadProcesses();
  }

  async addRunningProcess(): Promise<void> {
    let process: BmProcess | undefined;
    if (this.processControl.value == null) {
      process = undefined;
    } else {
      process = new BmProcess(this.processControl.value, undefined);
      if (!this.bmProcessService.isComplete(process)) {
        this.modalBmProcess = process;
        this.modalReference = this.modalService.open(this.errorProcessModal, {
          size: 'lg',
        });
        return;
      }
    }
    await this.listService.add({
      process: process,
      name: this.nameControl.value,
    });
    this.addRunningProcessForm.reset();
  }

  async loadProcesses(): Promise<void> {
    this.processes = await this.bmProcessService.getList();
  }

  async openDeleteProcessModal(
    runningProcess: RunningProcessEntry
  ): Promise<void> {
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

  get runningProcessesList(): RunningProcessEntry[] | undefined {
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
