import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProcessPattern } from '../../development-process-registry/process-pattern/process-pattern';
import { SituationalFactor } from '../../development-process-registry/method-elements/situational-factor/situational-factor';

@Component({
  selector: 'app-pattern-info',
  templateUrl: './pattern-info.component.html',
  styleUrls: ['./pattern-info.component.css'],
})
export class PatternInfoComponent implements OnChanges {
  @Input() processPattern: ProcessPattern;
  @Input() contextSituationalFactors: {
    list: string;
    element: SituationalFactor;
  }[] = [];

  needed: SituationalFactor[] = [];
  provided: SituationalFactor[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes.contextSituationalFactors) {
      this.needed = changes.contextSituationalFactors.currentValue.map(
        (factor) => factor.element
      );
    }
    if (changes.processPattern) {
      this.provided =
        changes.processPattern.currentValue.situationalFactors.map(
          (factor) => factor.element
        );
    }
  }
}
