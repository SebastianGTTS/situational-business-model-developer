import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DevelopmentMethodEntry } from '../../development-process-registry/development-method/development-method';
import { SituationalFactor } from '../../development-process-registry/method-elements/situational-factor/situational-factor';
import {
  SEARCH_FUNCTION,
  defaultSearchFunction,
} from '../../shared/search.service';
import { Selection } from '../../development-process-registry/development-method/selection';

@Component({
  selector: 'app-development-methods-selection-form',
  templateUrl: './development-methods-selection-form.component.html',
  styleUrls: ['./development-methods-selection-form.component.css'],
  providers: [{ provide: SEARCH_FUNCTION, useValue: defaultSearchFunction }],
})
export class DevelopmentMethodsSelectionFormComponent {
  @Input() developmentMethods?: DevelopmentMethodEntry[];
  @Input() contextSituationalFactors: Selection<SituationalFactor>[] = [];
  @Input() allowTypeFilter = false;

  @Output() selectDevelopmentMethod =
    new EventEmitter<DevelopmentMethodEntry>();
}
