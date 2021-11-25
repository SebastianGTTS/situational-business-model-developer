import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DevelopmentMethod } from '../../development-process-registry/development-method/development-method';
import { Decision } from '../../development-process-registry/bm-process/decision';
import { SituationalFactor } from '../../development-process-registry/method-elements/situational-factor/situational-factor';
import { Domain } from '../../development-process-registry/knowledge/domain';
import { BmProcess } from '../../development-process-registry/bm-process/bm-process';
import { Selection } from '../../development-process-registry/development-method/selection';

@Component({
  selector: 'app-method-info',
  templateUrl: './method-info.component.html',
  styleUrls: ['./method-info.component.css'],
})
export class MethodInfoComponent implements OnChanges {
  @Input() bmProcess: BmProcess;
  @Input() developmentMethod: DevelopmentMethod;
  @Input() decision: Decision;
  @Input() contextDomains: Domain[];
  @Input() contextSituationalFactors: Selection<SituationalFactor>[] = [];

  @Output() updateDecisions = new EventEmitter<any>();

  needed: SituationalFactor[] = [];
  provided: SituationalFactor[] = [];

  ngOnChanges(changes: SimpleChanges) {
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

  forceUpdate(data: { step: number; stepDecision: any }) {
    const stepDecisions = this.decision.stepDecisions.slice();
    stepDecisions[data.step] = data.stepDecision;
    this.updateDecisions.emit({ stepDecisions });
  }
}
