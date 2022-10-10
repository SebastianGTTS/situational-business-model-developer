import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProcessPattern } from '../../development-process-registry/process-pattern/process-pattern';
import {
  SituationalFactor,
  SituationalFactorEntry,
} from '../../development-process-registry/method-elements/situational-factor/situational-factor';
import { Selection } from '../../development-process-registry/development-method/selection';

@Component({
  selector: 'app-pattern-info',
  templateUrl: './pattern-info.component.html',
  styleUrls: ['./pattern-info.component.css'],
})
export class PatternInfoComponent implements OnChanges {
  @Input() processPattern!: ProcessPattern;
  @Input() contextSituationalFactors: Selection<SituationalFactor>[] = [];

  needed: SituationalFactor[] = [];
  provided: SituationalFactorEntry[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.contextSituationalFactors) {
      const currentContextSituationalFactors: Selection<SituationalFactor>[] =
        changes.contextSituationalFactors.currentValue;
      this.needed = currentContextSituationalFactors.map(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (factor) => factor.element!
      );
    }
    if (changes.processPattern) {
      const currentProcessPattern: ProcessPattern =
        changes.processPattern.currentValue;
      this.provided = currentProcessPattern.situationalFactors.map(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (factor) => factor.element!.toDb()
      );
    }
  }
}
