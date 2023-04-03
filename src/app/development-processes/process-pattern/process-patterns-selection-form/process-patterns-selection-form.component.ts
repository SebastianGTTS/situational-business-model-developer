import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { SituationalFactor } from '../../../development-process-registry/method-elements/situational-factor/situational-factor';
import { ProcessPatternEntry } from '../../../development-process-registry/process-pattern/process-pattern';
import {
  defaultSearchFunction,
  SEARCH_FUNCTION,
} from '../../../shared/search.service';
import { Selection } from '../../../development-process-registry/development-method/selection';

@Component({
  selector: 'app-process-patterns-selection-form',
  templateUrl: './process-patterns-selection-form.component.html',
  styleUrls: ['./process-patterns-selection-form.component.css'],
  providers: [{ provide: SEARCH_FUNCTION, useValue: defaultSearchFunction }],
})
export class ProcessPatternsSelectionFormComponent implements OnChanges {
  @Input() processPatterns?: ProcessPatternEntry[];
  @Input() contextSituationalFactors: Selection<SituationalFactor>[] = [];

  @Output() selectProcessPattern = new EventEmitter<ProcessPatternEntry>();

  authorNames: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.processPatterns && this.processPatterns != null) {
      this.authorNames = Array.from(
        new Set(
          (this.processPatterns
            ?.map((item) => item.author?.name)
            .filter((name) => name != null && name !== '') as string[]) ?? []
        )
      );
    }
  }
}
