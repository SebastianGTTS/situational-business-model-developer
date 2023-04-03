import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BmPhaseProcess } from 'src/app/development-process-registry/bm-process/bm-phase-process';
import { BmPhaseProcessService } from 'src/app/development-process-registry/bm-process/bm-phase-process.service';
import { MethodDecisionUpdate } from 'src/app/development-process-registry/bm-process/method-decision';
import { DevelopmentMethodEntry } from 'src/app/development-process-registry/development-method/development-method';
import { DevelopmentMethodService } from 'src/app/development-process-registry/development-method/development-method.service';
import { BmPhaseProcessEditComponent } from '../bm-phase-process-edit/bm-phase-process-edit.component';
import { DevelopmentMethodIncompleteModalComponent } from '../../development-method/development-method-incomplete-modal/development-method-incomplete-modal.component';
import { BmProcessLoaderService } from '../../shared/bm-process-loader.service';

@Component({
  selector: 'app-bm-phase-process-method',
  templateUrl: './bm-phase-process-method.component.html',
  styleUrls: ['./bm-phase-process-method.component.scss'],
})
export class BmPhaseProcessMethodComponent {
  @ViewChild(BmPhaseProcessEditComponent)
  bmPhaseProcessEditComponent!: BmPhaseProcessEditComponent;

  constructor(
    private bmProcessLoaderService: BmProcessLoaderService,
    private bmProcessService: BmPhaseProcessService,
    private developmentMethodService: DevelopmentMethodService,
    private modalService: NgbModal
  ) {}

  async updatePhases(phaseIds: string[]): Promise<void> {
    if (this.bmProcess != null) {
      await this.bmProcessService.updatePhaseSelection(
        this.bmProcess._id,
        new Set<string>(phaseIds)
      );
    }
  }

  async addDevelopmentMethod(
    phaseId: string,
    developmentMethod: DevelopmentMethodEntry
  ): Promise<void> {
    if (this.bmProcess != null) {
      try {
        await this.bmProcessService.addDecision(
          this.bmProcess._id,
          phaseId,
          developmentMethod._id
        );
        this.bmPhaseProcessEditComponent.resetSelectDevelopmentMethodModal();
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === 'Method not correctly defined'
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
  }

  async updateDecisions(
    phaseMethodDecisionId: string,
    methodDecisionUpdate: MethodDecisionUpdate
  ): Promise<void> {
    if (this.bmProcess != null) {
      await this.bmProcessService.updateDecision(
        this.bmProcess._id,
        phaseMethodDecisionId,
        methodDecisionUpdate
      );
    }
  }

  async updateDecisionNumber(
    decisionId: string,
    number: number
  ): Promise<void> {
    if (this.bmProcess != null) {
      await this.bmProcessService.updateDecisionNumber(
        this.bmProcess._id,
        decisionId,
        number
      );
    }
  }

  async removeDecision(phaseMethodDecisionId: string): Promise<void> {
    if (this.bmProcess != null) {
      await this.bmProcessService.removeDecision(
        this.bmProcess._id,
        phaseMethodDecisionId
      );
    }
  }

  get bmProcess(): BmPhaseProcess | undefined {
    return this.bmProcessLoaderService.bmPhaseProcess;
  }
}
