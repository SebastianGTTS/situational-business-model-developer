import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SituationalFactor } from '../../development-process-registry/method-elements/situational-factor/situational-factor';
import { ProcessPatternEntry } from '../../development-process-registry/process-pattern/process-pattern';
import {
  SEARCH_FUNCTION,
  defaultSearchFunction,
} from '../../shared/search.service';
import { Selection } from '../../development-process-registry/development-method/selection';

@Component({
  selector: 'app-process-patterns-selection-form',
  templateUrl: './process-patterns-selection-form.component.html',
  styleUrls: ['./process-patterns-selection-form.component.css'],
  providers: [{ provide: SEARCH_FUNCTION, useValue: defaultSearchFunction }],
})
export class ProcessPatternsSelectionFormComponent {
  @Input() processPatterns?: ProcessPatternEntry[];
  @Input() contextSituationalFactors: Selection<SituationalFactor>[] = [];

  @Output() selectProcessPattern = new EventEmitter<ProcessPatternEntry>();
}
