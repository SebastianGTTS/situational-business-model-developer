import { Component, OnInit, ViewChild } from '@angular/core';
import { RunningProcess } from '../../development-process-registry/running-process/running-process';
import { RunningProcessService } from '../../development-process-registry/running-process/running-process.service';
import { BmProcess } from '../../development-process-registry/bm-process/bm-process';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  processes: BmProcess[] = [];

  modalRunningProcess: RunningProcess;
  private modalReference: NgbModalRef;

  @ViewChild('deleteProcessModal', { static: true }) deleteProcessModal: any;

  constructor(
    private bmProcessService: BmProcessService,
    private fb: FormBuilder,
    private listService: ListService<RunningProcess>,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    void this.loadProcesses();
    this.initForm();
  }

  initForm() {
    this.addRunningProcessForm = this.fb.group({
      name: ['', Validators.required],
      process: [null, Validators.required],
    });
  }

  async addRunningProcess() {
    await this.listService.add({
      process: this.processControl.value,
      name: this.nameControl.value,
    });
    this.initForm();
  }

  async loadProcesses(): Promise<void> {
    this.processes = await this.bmProcessService.getList();
  }

  async openDeleteProcessModal(runningProcess: RunningProcess) {
    this.modalRunningProcess = runningProcess;
    this.modalReference = this.modalService.open(this.deleteProcessModal, {
      size: 'lg',
    });
  }

  async deleteRunningProcess(id: string) {
    await this.listService.delete(id);
  }

  get processControl() {
    return this.addRunningProcessForm.get('process');
  }

  get nameControl() {
    return this.addRunningProcessForm.get('name');
  }

  get runningProcessesList(): RunningProcess[] {
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
