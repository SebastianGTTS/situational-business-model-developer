import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DevelopmentMethodEntry } from '../../development-process-registry/development-method/development-method';
import { SituationalFactor } from '../../development-process-registry/method-elements/situational-factor/situational-factor';

@Component({
  selector: 'app-development-method-selection-form',
  templateUrl: './development-method-selection-form.component.html',
  styleUrls: ['./development-method-selection-form.component.css'],
})
export class DevelopmentMethodSelectionFormComponent implements OnChanges {
  @Input() developmentMethod: DevelopmentMethodEntry;
  @Input() contextSituationalFactors: {
    list: string;
    element?: SituationalFactor;
  }[] = [];

  @Output() selectDevelopmentMethod =
    new EventEmitter<DevelopmentMethodEntry>();

  needed: SituationalFactor[] = [];
  provided: SituationalFactor[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.contextSituationalFactors) {
      this.needed = changes.contextSituationalFactors.currentValue.map(
        (factor) => factor.element
      );
    }
    if (changes.developmentMethod) {
      this.provided =
        changes.developmentMethod.currentValue.situationalFactors.map(
          (factor) => factor.element
        );
    }
  }
}
