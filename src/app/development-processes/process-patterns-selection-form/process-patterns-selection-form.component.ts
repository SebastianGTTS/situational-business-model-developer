import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SituationalFactor } from '../../development-process-registry/method-elements/situational-factor/situational-factor';
import { ProcessPatternEntry } from '../../development-process-registry/process-pattern/process-pattern';
import { SEARCH_FUNCTION, searchFunction } from '../../shared/search.service';

@Component({
  selector: 'app-process-patterns-selection-form',
  templateUrl: './process-patterns-selection-form.component.html',
  styleUrls: ['./process-patterns-selection-form.component.css'],
  providers: [{ provide: SEARCH_FUNCTION, useValue: searchFunction }],
})
export class ProcessPatternsSelectionFormComponent {
  @Input() processPatterns: ProcessPatternEntry[];
  @Input() contextSituationalFactors: {
    list: string;
    element?: SituationalFactor;
  }[] = [];

  @Output() selectProcessPattern = new EventEmitter<ProcessPatternEntry>();
}
