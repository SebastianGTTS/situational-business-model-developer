import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { PhaseMethodDecision } from '../../../development-process-registry/bm-process/phase-method-decision';
import { BmPhaseProcessService } from '../../../development-process-registry/bm-process/bm-phase-process.service';

enum DecisionStatus {
  COMPLETE,
  INCOMPLETE,
  MISSING_NUMBER,
  MISSING_STEP_CONFIGURATION,
}

@Component({
  selector: 'app-bm-phase-process-board-column',
  templateUrl: './bm-phase-process-board-column.component.html',
  styleUrls: ['./bm-phase-process-board-column.component.css'],
})
export class BmPhaseProcessBoardColumnComponent implements OnChanges {
  @Input() index?: number;

  @Input() phaseMethodDecisions!: PhaseMethodDecision[];

  /**
   * Emits the id of the PhaseMethodDecision
   */
  @Output() infoDecision = new EventEmitter<string>();
  /**
   * Emits the id of the PhaseMethodDecision
   */
  @Output() editDecision = new EventEmitter<string>();
  /**
   * Emits the id of the PhaseMethodDecision together with the edited number
   */
  @Output() editDecisionNumber = new EventEmitter<{
    decisionId: string;
    number: number;
  }>();
  /**
   * Emits the id of the PhaseMethodDecision
   */
  @Output() removeDecision = new EventEmitter<string>();

  page = 1;
  pageSize = 4;

  decisionStatuses: { [decisionId: string]: DecisionStatus } = {};

  constructor(private bmPhaseProcessService: BmPhaseProcessService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.phaseMethodDecisions) {
      for (const decision of this.phaseMethodDecisions) {
        if (
          !this.bmPhaseProcessService.checkDecisionStepArtifacts(
            decision.decision
          )
        ) {
          this.decisionStatuses[decision.id] =
            DecisionStatus.MISSING_STEP_CONFIGURATION;
        } else if (!decision.decision.isComplete()) {
          this.decisionStatuses[decision.id] = DecisionStatus.INCOMPLETE;
        } else if (decision.number == null) {
          this.decisionStatuses[decision.id] = DecisionStatus.MISSING_NUMBER;
        } else {
          this.decisionStatuses[decision.id] = DecisionStatus.COMPLETE;
        }
      }
      if ((this.page - 1) * this.pageSize >= this.phaseMethodDecisions.length) {
        this.page = 1;
      }
    }
  }

  focusElement(nodeId: string): void {
    const index = this.phaseMethodDecisions.findIndex(
      (phaseMethodDecision) => phaseMethodDecision.id === nodeId
    );
    if (index === -1) {
      return;
    }
    this.page = Math.floor(index / this.pageSize) + 1;
  }

  trackBy(index: number, item: PhaseMethodDecision): string {
    return item.id;
  }

  get decisionStatus(): typeof DecisionStatus {
    return DecisionStatus;
  }
}
