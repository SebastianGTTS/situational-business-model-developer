import {
  Component,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { PhaseDecision } from '../../../development-process-registry/bm-process/phase-decision';
import { BmPhaseProcessBoardColumnComponent } from '../bm-phase-process-board-column/bm-phase-process-board-column.component';

@Component({
  selector: 'app-bm-phase-process-board',
  templateUrl: './bm-phase-process-board.component.html',
  styleUrls: ['./bm-phase-process-board.component.css'],
})
export class BmPhaseProcessBoardComponent {
  @Input() phaseDecisions!: PhaseDecision[];

  @Output() addDevelopmentMethod = new EventEmitter<PhaseDecision>();
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

  @ViewChildren(BmPhaseProcessBoardColumnComponent)
  bmPhaseProcessBoardColumnComponents?: QueryList<BmPhaseProcessBoardColumnComponent>;

  focusElement(nodeId: string): void {
    this.bmPhaseProcessBoardColumnComponents?.forEach((component) =>
      component.focusElement(nodeId)
    );
  }

  trackBy(index: number, item: PhaseDecision): string {
    return item.phase.id;
  }
}
