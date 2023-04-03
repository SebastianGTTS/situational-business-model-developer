import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BmProcessEntry } from '../../../development-process-registry/bm-process/bm-process';
import {
  defaultSearchFunction,
  SEARCH_FUNCTION,
} from '../../../shared/search.service';

@Component({
  selector: 'app-bm-processes-selection',
  templateUrl: './bm-processes-selection.component.html',
  styleUrls: ['./bm-processes-selection.component.scss'],
  providers: [{ provide: SEARCH_FUNCTION, useValue: defaultSearchFunction }],
})
export class BmProcessesSelectionComponent {
  @Input() bmProcesses?: BmProcessEntry[];

  @Output() selectBmProcess = new EventEmitter<BmProcessEntry>();
}
