import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DevelopmentMethod } from '../../development-process-registry/development-method/development-method';
import { SituationalFactor } from '../../development-process-registry/method-elements/situational-factor/situational-factor';
import { SEARCH_FUNCTION, searchFunction } from '../../shared/search.service';

@Component({
  selector: 'app-development-methods-selection-form',
  templateUrl: './development-methods-selection-form.component.html',
  styleUrls: ['./development-methods-selection-form.component.css'],
  providers: [{ provide: SEARCH_FUNCTION, useValue: searchFunction }],
})
export class DevelopmentMethodsSelectionFormComponent {
  @Input() developmentMethods: DevelopmentMethod[];
  @Input() contextSituationalFactors: {
    list: string;
    element: SituationalFactor;
  }[] = [];

  @Output() selectDevelopmentMethod = new EventEmitter<DevelopmentMethod>();
}
