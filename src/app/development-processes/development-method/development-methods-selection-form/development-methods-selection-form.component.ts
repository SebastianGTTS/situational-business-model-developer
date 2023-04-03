import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DevelopmentMethodEntry } from '../../../development-process-registry/development-method/development-method';
import { SituationalFactor } from '../../../development-process-registry/method-elements/situational-factor/situational-factor';
import {
  defaultSearchFunction,
  SEARCH_FUNCTION,
} from '../../../shared/search.service';
import { Selection } from '../../../development-process-registry/development-method/selection';

@Component({
  selector: 'app-development-methods-selection-form',
  templateUrl: './development-methods-selection-form.component.html',
  styleUrls: ['./development-methods-selection-form.component.css'],
  providers: [{ provide: SEARCH_FUNCTION, useValue: defaultSearchFunction }],
})
export class DevelopmentMethodsSelectionFormComponent implements OnChanges {
  @Input() developmentMethods?: DevelopmentMethodEntry[];
  @Input() contextSituationalFactors: Selection<SituationalFactor>[] = [];
  @Input() allowTypeFilter = false;

  @Output() selectDevelopmentMethod =
    new EventEmitter<DevelopmentMethodEntry>();

  authorNames: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.developmentMethods && this.developmentMethods != null) {
      this.authorNames = Array.from(
        new Set(
          (this.developmentMethods
            ?.map((item) => item.author?.name)
            .filter((name) => name != null && name !== '') as string[]) ?? []
        )
      );
    }
  }
}
