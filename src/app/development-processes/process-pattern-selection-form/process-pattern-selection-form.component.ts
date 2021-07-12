import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ProcessPattern } from '../../development-process-registry/process-pattern/process-pattern';
import { SituationalFactor } from '../../development-process-registry/method-elements/situational-factor/situational-factor';

@Component({
  selector: 'app-process-pattern-selection-form',
  templateUrl: './process-pattern-selection-form.component.html',
  styleUrls: ['./process-pattern-selection-form.component.css']
})
export class ProcessPatternSelectionFormComponent implements OnChanges {

  @Input() processPattern: ProcessPattern;
  @Input() contextSituationalFactors: { list: string, element: SituationalFactor }[] = [];

  @Output() selectProcessPattern = new EventEmitter<ProcessPattern>();

  needed: SituationalFactor[] = [];
  provided: SituationalFactor[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes.contextSituationalFactors) {
      this.needed = changes.contextSituationalFactors.currentValue.map((factor) => factor.element);
    }
    if (changes.processPattern) {
      this.provided = changes.processPattern.currentValue.situationalFactors.map((factor) => factor.element);
    }
  }

}
