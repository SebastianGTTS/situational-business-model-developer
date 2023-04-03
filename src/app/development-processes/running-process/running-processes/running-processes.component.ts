import { Component, OnInit } from '@angular/core';
import { RunningProcessEntry } from '../../../development-process-registry/running-process/running-process';
import {
  BmPatternProcess,
  isBmPatternProcessEntry,
} from '../../../development-process-registry/bm-process/bm-pattern-process';
import { FormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { BmPatternProcessService } from '../../../development-process-registry/bm-process/bm-pattern-process.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ELEMENT_SERVICE, ListService } from '../../../shared/list.service';
import { BmProcessEntry } from '../../../development-process-registry/bm-process/bm-process';
import {
  BmPhaseProcess,
  isBmPhaseProcessEntry,
} from '../../../development-process-registry/bm-process/bm-phase-process';
import { BmPhaseProcessService } from '../../../development-process-registry/bm-process/bm-phase-process.service';
import { BmProcessService } from '../../../development-process-registry/bm-process/bm-process.service';
import {
  RunningProcessInitTypes,
  RunningProcessTypes,
  RunningProcessTypesService,
} from '../../../development-process-registry/running-process/running-process-types.service';
import {
  defaultSearchFunction,
  SEARCH_FUNCTION,
  SearchService,
} from '../../../shared/search.service';
import { Router } from '@angular/router';
import { ListFilterService } from '../../../shared/list-filter.service';
import { FilterService } from '../../../shared/filter.service';
import { BmProcessErrorModalComponent } from '../../bm-process/bm-process-error-modal/bm-process-error-modal.component';

@Component({
  selector: 'app-running-processes',
  templateUrl: './running-processes.component.html',
  styleUrls: ['./running-processes.component.css'],
  providers: [
    FilterService,
    SearchService,
    { provide: SEARCH_FUNCTION, useValue: defaultSearchFunction },
    ListFilterService,
    { provide: ListService, useExisting: ListFilterService },
    { provide: ELEMENT_SERVICE, useExisting: RunningProcessTypesService },
  ],
})
export class RunningProcessesComponent implements OnInit {
  addRunningProcessForm = this.fb.group({
    name: ['', Validators.required],
    process: this.fb.control<BmProcessEntry | null>(null),
  });
  processes: BmProcessEntry[] = [];

  private modalReference?: NgbModalRef;

  constructor(
    private bmPatternProcessService: BmPatternProcessService,
    private bmPhaseProcessService: BmPhaseProcessService,
    private bmProcessService: BmProcessService,
    private fb: FormBuilder,
    private listService: ListService<
      RunningProcessTypes,
      RunningProcessInitTypes
    >,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    void this.loadProcesses();
  }

  async addRunningProcess(): Promise<void> {
    const formValue = this.addRunningProcessForm.value;
    const processValue = formValue.process;
    const nameValue = formValue.name;
    if (nameValue == null) {
      throw new Error('Form is invalid');
    }
    let process: BmPatternProcess | BmPhaseProcess | undefined;
    if (processValue == null) {
      process = undefined;
    } else {
      let complete: boolean;
      if (isBmPatternProcessEntry(processValue)) {
        process = new BmPatternProcess(processValue, undefined);
        complete = await this.bmPatternProcessService.isComplete(process);
      } else if (isBmPhaseProcessEntry(processValue)) {
        process = new BmPhaseProcess(processValue, undefined);
        complete = await this.bmPhaseProcessService.isComplete(process);
      } else {
        throw new Error(
          'Can only instantiate running processes with pattern or phase based processes'
        );
      }
      if (!complete) {
        this.modalReference = this.modalService.open(
          BmProcessErrorModalComponent,
          {
            size: 'lg',
          }
        );
        (
          this.modalReference.componentInstance as BmProcessErrorModalComponent
        ).bmProcess = process;
        return;
      }
    }
    const addedElement = await this.listService.add({
      process: process,
      name: nameValue,
    });
    this.addRunningProcessForm.reset();
    await this.router.navigate(this.viewLinkFunction(addedElement.toDb()), {
      queryParams: {
        created: true,
      },
    });
  }

  async loadProcesses(): Promise<void> {
    this.processes = await this.bmProcessService.getList();
  }

  get processControl(): UntypedFormControl {
    return this.addRunningProcessForm.get('process') as UntypedFormControl;
  }

  get nameControl(): UntypedFormControl {
    return this.addRunningProcessForm.get('name') as UntypedFormControl;
  }

  get viewLinkFunction(): (item: RunningProcessEntry) => string[] {
    return (item: RunningProcessEntry) => [
      '/',
      'runningprocess',
      'runningprocessview',
      item._id,
    ];
  }
}
