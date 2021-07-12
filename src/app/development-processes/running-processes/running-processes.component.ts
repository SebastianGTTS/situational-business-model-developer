import { Component, OnInit, ViewChild } from '@angular/core';
import { RunningProcess } from '../../development-process-registry/running-process/running-process';
import { RunningProcessService } from '../../development-process-registry/running-process/running-process.service';
import { BmProcess } from '../../development-process-registry/bm-process/bm-process';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BmProcessService } from '../../development-process-registry/bm-process/bm-process.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-running-processes',
  templateUrl: './running-processes.component.html',
  styleUrls: ['./running-processes.component.css']
})
export class RunningProcessesComponent implements OnInit {

  runningProcessesList: RunningProcess[];

  addRunningProcessForm: FormGroup;
  processes: BmProcess[] = [];

  modalRunningProcess: RunningProcess;
  private modalReference: NgbModalRef;

  @ViewChild('deleteProcessModal', {static: true}) deleteProcessModal: any;

  constructor(
    private bmProcessService: BmProcessService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private runningProcessService: RunningProcessService,
  ) {
  }

  ngOnInit() {
    this.loadRunningProcesses().then();
    this.loadProcesses().then();
    this.initForm();
  }

  initForm() {
    this.addRunningProcessForm = this.fb.group({
      name: ['', Validators.required],
      process: [null, Validators.required],
    });
  }

  async addRunningProcess() {
    await this.runningProcessService.addRunningProcess(this.processControl.value, this.nameControl.value);
    this.initForm();
    await this.loadRunningProcesses();
  }

  async loadProcesses() {
    this.processes = (await this.bmProcessService.getBmProcessList()).docs;
  }

  async loadRunningProcesses() {
    this.runningProcessesList = (await this.runningProcessService.getRunningProcessesList()).docs;
  }

  async openDeleteProcessModal(id: string) {
    this.modalRunningProcess = await this.runningProcessService.getRunningProcess(id);
    this.modalReference = this.modalService.open(this.deleteProcessModal, {size: 'lg'});
  }

  async deleteRunningProcess(id: string) {
    await this.runningProcessService.deleteRunningProcess(id);
    await this.loadRunningProcesses();
  }

  get processControl() {
    return this.addRunningProcessForm.get('process');
  }

  get nameControl() {
    return this.addRunningProcessForm.get('name');
  }

}
