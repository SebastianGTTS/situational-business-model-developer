import { Component, Input } from '@angular/core';
import { ELEMENT_SERVICE, ListService } from '../../shared/list.service';
import {
  RunningProcess,
  RunningProcessEntry,
  RunningProcessInit,
} from '../../development-process-registry/running-process/running-process';
import { RunningProcessContextService } from '../../development-process-registry/running-process/running-process-context.service';

@Component({
  selector: 'app-running-processes-context-list',
  templateUrl: './running-processes-context-list.component.html',
  styleUrls: ['./running-processes-context-list.component.css'],
  providers: [
    ListService,
    { provide: ELEMENT_SERVICE, useExisting: RunningProcessContextService },
  ],
})
export class RunningProcessesContextListComponent {
  @Input() editable = false;

  constructor(
    private listService: ListService<RunningProcess, RunningProcessInit>
  ) {}

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
