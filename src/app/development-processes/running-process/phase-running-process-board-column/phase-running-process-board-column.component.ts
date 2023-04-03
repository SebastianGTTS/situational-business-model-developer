import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { PhaseMethodDecision } from '../../../development-process-registry/bm-process/phase-method-decision';

@Component({
  selector: 'app-phase-running-process-board-column',
  templateUrl: './phase-running-process-board-column.component.html',
  styleUrls: ['./phase-running-process-board-column.component.css'],
})
export class PhaseRunningProcessBoardColumnComponent implements OnChanges {
  @Input() executedDecisionIds!: Set<string>;
  @Input() missingArtifactDecisionIds?: Set<string>;
  @Input() executionIndex!: number;
  @Input() phaseMethodDecisions!: PhaseMethodDecision[];
  @Input() editEnaction = false;

  @Output() infoDecision = new EventEmitter<PhaseMethodDecision>();
  @Output() startExecution = new EventEmitter<PhaseMethodDecision>();
  @Output() fakeExecution = new EventEmitter<PhaseMethodDecision>();
  @Output() skipExecution = new EventEmitter<PhaseMethodDecision>();

  page = 1;
  pageSize = 4;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.phaseMethodDecisions) {
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
}
