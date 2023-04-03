import { Component, Input, ViewChild } from '@angular/core';
import {
  RunningPhaseProcess,
  RunningPhaseProcessInit,
} from '../../../development-process-registry/running-process/running-phase-process';
import { ContextChangeRunningProcess } from '../../../development-process-registry/running-process/running-full-process';
import { RunningPhaseProcessContextService } from '../../../development-process-registry/running-process/running-phase-process-context.service';
import { DevelopmentMethodEntry } from '../../../development-process-registry/development-method/development-method';
import { RunningProcessContextEditSelectDecisionModalComponent } from '../running-process-context-edit-select-decision-modal/running-process-context-edit-select-decision-modal.component';
import { RunningProcessContextEditSelectDecisionModal } from '../running-process-context-edit-select-decision-modal/running-process-context-edit-select-decision-modal';
import { ContextChangeErrors } from '../../../development-process-registry/running-process/running-process-context.service';
import { DevelopmentMethodIncompleteModalComponent } from '../../development-method/development-method-incomplete-modal/development-method-incomplete-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BmPhaseProcessEditComponent } from '../../bm-process/bm-phase-process-edit/bm-phase-process-edit.component';
import { MethodDecisionUpdate } from '../../../development-process-registry/bm-process/method-decision';
import { DevelopmentMethodService } from '../../../development-process-registry/development-method/development-method.service';
import { Updatable, UPDATABLE } from '../../../shared/updatable';
import { RunningProcessContextEditBaseComponent } from '../running-process-context-edit-base/running-process-context-edit-base.component';

@Component({
  selector: 'app-running-phase-process-context-edit',
  templateUrl: './running-phase-process-context-edit.component.html',
  styleUrls: ['./running-phase-process-context-edit.component.css'],
  providers: [
    {
      provide: UPDATABLE,
      useExisting: RunningPhaseProcessContextEditComponent,
    },
  ],
})
export class RunningPhaseProcessContextEditComponent implements Updatable {
  @Input() runningProcess!: RunningPhaseProcess & ContextChangeRunningProcess;

  @ViewChild(BmPhaseProcessEditComponent)
  bmPhaseProcessEditComponent?: BmPhaseProcessEditComponent;
  @ViewChild(RunningProcessContextEditBaseComponent)
  runningProcessContextEditBaseComponent?: RunningProcessContextEditBaseComponent<
    RunningPhaseProcess,
    RunningPhaseProcessInit
  >;

  constructor(
    private developmentMethodService: DevelopmentMethodService,
    private modalService: NgbModal,
    private runningPhaseProcessContextService: RunningPhaseProcessContextService
  ) {}

  update(): void {
    this.runningProcessContextEditBaseComponent?.update();
  }

  async updatePhases(phaseIds: string[]): Promise<void> {
    await this.runningPhaseProcessContextService.updatePhaseSelection(
      this.runningProcess._id,
      new Set<string>(phaseIds)
    );
  }

  async updateDecisions(
    phaseMethodDecisionId: string,
    update: MethodDecisionUpdate
  ): Promise<void> {
    await this.runningPhaseProcessContextService.updateDecision(
      this.runningProcess._id,
      phaseMethodDecisionId,
      update
    );
  }

  async updateDecisionNumber(
    decisionId: string,
    number: number
  ): Promise<void> {
    await this.runningPhaseProcessContextService.updateDecisionNumber(
      this.runningProcess._id,
      decisionId,
      number
    );
  }

  async insertDevelopmentMethod(
    nodeId: string,
    developmentMethod: DevelopmentMethodEntry
  ): Promise<void> {
    const removedDecisions =
      this.runningProcess.contextChangeInfo.getRemovedMethods(
        developmentMethod._id
      );
    if (removedDecisions.length > 0) {
      const modal = this.modalService.open(
        RunningProcessContextEditSelectDecisionModalComponent,
        {
          size: 'lg',
        }
      );
      const component: RunningProcessContextEditSelectDecisionModal =
        modal.componentInstance;
      component.runningProcess = this.runningProcess;
      component.developmentMethod = developmentMethod;
      component.removedMethods = removedDecisions;
      component.onAllInputsSet();
      component.insertDevelopmentMethodNew.subscribe(() => {
        void this._insertDevelopmentMethod(nodeId, developmentMethod);
        modal.close();
      });
      component.insertDevelopmentMethodDecision.subscribe((event) => {
        void this.runningPhaseProcessContextService.insertDecision(
          this.runningProcess._id,
          nodeId,
          event.id
        );
        modal.close();
      });
      this.bmPhaseProcessEditComponent?.resetSelectDevelopmentMethodModal();
      return;
    }
    await this._insertDevelopmentMethod(nodeId, developmentMethod);
  }

  private async _insertDevelopmentMethod(
    nodeId: string,
    developmentMethod: DevelopmentMethodEntry
  ): Promise<void> {
    try {
      await this.runningPhaseProcessContextService.addDecision(
        this.runningProcess._id,
        nodeId,
        developmentMethod._id
      );
      this.bmPhaseProcessEditComponent?.resetSelectDevelopmentMethodModal();
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === ContextChangeErrors.METHOD_ERROR
      ) {
        const method = await this.developmentMethodService.get(
          developmentMethod._id
        );
        const modal = this.modalService.open(
          DevelopmentMethodIncompleteModalComponent
        );
        const component: DevelopmentMethodIncompleteModalComponent =
          modal.componentInstance;
        component.developmentMethod = method;
      } else {
        throw error;
      }
    }
  }

  async removeDevelopmentMethod(nodeId: string): Promise<void> {
    await this.runningPhaseProcessContextService.removeDevelopmentMethod(
      this.runningProcess._id,
      nodeId
    );
  }
}
