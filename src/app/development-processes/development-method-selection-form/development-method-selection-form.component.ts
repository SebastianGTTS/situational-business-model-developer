import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DevelopmentMethodEntry } from '../../development-process-registry/development-method/development-method';
import {
  SituationalFactor,
  SituationalFactorEntry,
} from '../../development-process-registry/method-elements/situational-factor/situational-factor';
import { Selection } from '../../development-process-registry/development-method/selection';

@Component({
  selector: 'app-development-method-selection-form',
  templateUrl: './development-method-selection-form.component.html',
  styleUrls: ['./development-method-selection-form.component.css'],
})
export class DevelopmentMethodSelectionFormComponent implements OnChanges {
  @Input() developmentMethod!: DevelopmentMethodEntry;
  @Input() contextSituationalFactors: Selection<SituationalFactor>[] = [];

  @Output() selectDevelopmentMethod =
    new EventEmitter<DevelopmentMethodEntry>();

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
    if (changes.developmentMethod) {
      const currentDevelopmentMethod: DevelopmentMethodEntry =
        changes.developmentMethod.currentValue;
      this.provided = currentDevelopmentMethod.situationalFactors.map(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (factor) => factor.element!
      );
    }
  }
}
