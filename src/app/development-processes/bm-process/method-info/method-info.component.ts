import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { DevelopmentMethod } from '../../../development-process-registry/development-method/development-method';
import {
  SituationalFactor,
  SituationalFactorEntry,
} from '../../../development-process-registry/method-elements/situational-factor/situational-factor';
import { Domain } from '../../../development-process-registry/knowledge/domain';
import { BmProcess } from '../../../development-process-registry/bm-process/bm-process';
import { Selection } from '../../../development-process-registry/development-method/selection';
import {
  MethodDecision,
  MethodDecisionUpdate,
} from '../../../development-process-registry/bm-process/method-decision';
import { StepDecision } from '../../../development-process-registry/module-api/module-method';
import { RunningProcess } from '../../../development-process-registry/running-process/running-process';
import { UPDATABLE, Updatable } from '../../../shared/updatable';
import { BmProcessService } from '../../../development-process-registry/bm-process/bm-process.service';

@Component({
  selector: 'app-method-info',
  templateUrl: './method-info.component.html',
  styleUrls: ['./method-info.component.css'],
  providers: [{ provide: UPDATABLE, useExisting: MethodInfoComponent }],
})
export class MethodInfoComponent implements OnChanges, Updatable {
  @Input() bmProcess?: BmProcess;
  @Input() runningProcess?: RunningProcess;
  @Input() developmentMethod!: DevelopmentMethod;
  @Input() decision!: MethodDecision;
  @Input() contextDomains!: Domain[];
  @Input() contextSituationalFactors: Selection<SituationalFactor>[] = [];

  @Output() updateDecisions = new EventEmitter<MethodDecisionUpdate>();

  needed: SituationalFactor[] = [];
  provided: SituationalFactorEntry[] = [];

  inputArtifactsComplete = true;
  outputArtifactsComplete = true;
  stakeholdersComplete = true;
  toolsComplete = true;
  stepsComplete = true;

  @ViewChildren(UPDATABLE) updatable!: QueryList<Updatable>;

  constructor(private bmProcessService: BmProcessService) {}

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
      const currentDevelopmentMethod: DevelopmentMethod =
        changes.developmentMethod.currentValue;
      this.provided = currentDevelopmentMethod.situationalFactors.map(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (factor) => factor.element!.toDb()
      );
    }
    if (changes.decision) {
      const currentDecision: MethodDecision = changes.decision.currentValue;
      this.inputArtifactsComplete = currentDecision.inputArtifacts.isComplete();
      this.outputArtifactsComplete =
        currentDecision.outputArtifacts.isComplete();
      this.stakeholdersComplete = currentDecision.stakeholders.isComplete();
      this.toolsComplete = currentDecision.tools.isComplete();
      this.stepsComplete =
        this.bmProcessService.checkDecisionStepArtifacts(currentDecision);
    }
  }

  forceUpdate(data: { step: number; stepDecision: StepDecision }): void {
    const stepDecisions = this.decision.stepDecisions.slice();
    stepDecisions[data.step] = data.stepDecision;
    this.updateDecisions.emit({ stepDecisions });
  }

  update(): void {
    for (const updatable of this.updatable) {
      updatable.update();
    }
  }
}
