import {
  Component,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { PhaseDecision } from '../../../development-process-registry/bm-process/phase-decision';
import { PhaseMethodDecision } from '../../../development-process-registry/bm-process/phase-method-decision';
import { PhaseRunningProcessBoardColumnComponent } from '../phase-running-process-board-column/phase-running-process-board-column.component';

@Component({
  selector: 'app-phase-running-process-board',
  templateUrl: './phase-running-process-board.component.html',
  styleUrls: ['./phase-running-process-board.component.css'],
})
export class PhaseRunningProcessBoardComponent {
  @Input() executedDecisionIds!: Set<string>;
  @Input() missingArtifactDecisionIds?: Set<string>;
  @Input() executionIndex!: number;
  @Input() phaseDecisions!: PhaseDecision[];
  @Input() editEnaction = false;

  @Output() infoDecision = new EventEmitter<PhaseMethodDecision>();
  @Output() startExecution = new EventEmitter<PhaseMethodDecision>();
  @Output() fakeExecution = new EventEmitter<PhaseMethodDecision>();
  @Output() skipExecution = new EventEmitter<PhaseMethodDecision>();

  @ViewChildren(PhaseRunningProcessBoardColumnComponent)
  phaseRunningProcessBoardColumnComponents!: QueryList<PhaseRunningProcessBoardColumnComponent>;

  focusElement(nodeId: string): void {
    this.phaseRunningProcessBoardColumnComponents.forEach((component) =>
      component.focusElement(nodeId)
    );
  }

  trackBy(index: number, item: PhaseDecision): string {
    return item.phase.id;
  }
}
