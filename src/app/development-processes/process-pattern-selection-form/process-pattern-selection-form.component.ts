import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ProcessPatternEntry } from '../../development-process-registry/process-pattern/process-pattern';
import {
  SituationalFactor,
  SituationalFactorEntry,
} from '../../development-process-registry/method-elements/situational-factor/situational-factor';
import { Selection } from '../../development-process-registry/development-method/selection';

@Component({
  selector: 'app-process-pattern-selection-form',
  templateUrl: './process-pattern-selection-form.component.html',
  styleUrls: ['./process-pattern-selection-form.component.css'],
})
export class ProcessPatternSelectionFormComponent implements OnChanges {
  @Input() processPattern!: ProcessPatternEntry;
  @Input() contextSituationalFactors: Selection<SituationalFactor>[] = [];

  @Output() selectProcessPattern = new EventEmitter<ProcessPatternEntry>();

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
      const currentProcessPattern: ProcessPatternEntry =
        changes.processPattern.currentValue;
      this.provided = currentProcessPattern.situationalFactors.map(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (factor) => factor.element!
      );
    }
  }
}
