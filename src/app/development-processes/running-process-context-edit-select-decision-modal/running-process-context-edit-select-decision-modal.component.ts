import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DevelopmentMethodEntry } from '../../development-process-registry/development-method/development-method';
import { RunningProcessContextEditSelectDecisionModal } from './running-process-context-edit-select-decision-modal';
import { RemovedMethod } from '../../development-process-registry/running-process/removed-method';
import { RunningMethodInfo } from '../../development-process-registry/running-process/running-method-info';
import { RunningArtifact } from '../../development-process-registry/running-process/running-artifact';
import { ArtifactVersion } from '../../development-process-registry/running-process/artifact-version';
import { ContextChangeRunningProcess } from '../../development-process-registry/running-process/running-process';

type RemovedMethodMapping = {
  [id: string]: {
    executions: {
      info: RunningMethodInfo;
      artifacts: { artifact: RunningArtifact; versions: ArtifactVersion[] }[];
    }[];
  };
};

@Component({
  selector: 'app-running-process-context-edit-select-decision-modal',
  templateUrl:
    './running-process-context-edit-select-decision-modal.component.html',
  styleUrls: [
    './running-process-context-edit-select-decision-modal.component.css',
  ],
})
export class RunningProcessContextEditSelectDecisionModalComponent
  implements OnChanges, OnDestroy, RunningProcessContextEditSelectDecisionModal
{
  @Input() runningProcess!: ContextChangeRunningProcess;
  @Input() developmentMethod!: DevelopmentMethodEntry;
  @Input() removedMethods!: RemovedMethod[];

  @Output() insertDevelopmentMethodDecision = new EventEmitter<RemovedMethod>();
  @Output() insertDevelopmentMethodNew = new EventEmitter<void>();

  removedMethodMapping?: RemovedMethodMapping;

  constructor(private activeModal: NgbActiveModal) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.removedMethods) {
      this.calculateRemovedMethodMapping();
    }
  }

  ngOnDestroy(): void {
    // call complete as its modal component
    this.insertDevelopmentMethodDecision.complete();
    this.insertDevelopmentMethodNew.complete();
  }

  onAllInputsSet(): void {
    this.calculateRemovedMethodMapping();
  }

  private calculateRemovedMethodMapping(): void {
    const mapping: RemovedMethodMapping = {};
    for (const removedMethod of this.removedMethods) {
      mapping[removedMethod.id] = {
        executions: removedMethod.executions.map((executionId) => {
          const methodInfo = this.runningProcess.getExecutedMethod(executionId);
          if (methodInfo == null) {
            throw new Error('Missing executed method');
          }
          return {
            info: methodInfo,
            artifacts:
              this.runningProcess.getArtifactsOfExecutedMethod(executionId),
          };
        }),
      };
    }
    this.removedMethodMapping = mapping;
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }
}
