import { Component, Input, ViewChild } from '@angular/core';
import { ContextChangeRunningProcess } from '../../development-process-registry/running-process/running-process';
import { MethodDecision } from '../../development-process-registry/bm-process/method-decision';
import { BmProcessEditDiagramComponent } from '../bm-process-edit-diagram/bm-process-edit-diagram.component';
import { Domain } from '../../development-process-registry/knowledge/domain';
import { SelectionInit } from '../../development-process-registry/development-method/selection';
import { SituationalFactorInit } from '../../development-process-registry/method-elements/situational-factor/situational-factor';
import {
  ContextChangeErrors,
  RunningProcessContextService,
} from '../../development-process-registry/running-process/running-process-context.service';
import { BmProcessDiagram } from '../../development-process-registry/bm-process/bm-process';
import { Updatable, UPDATABLE } from '../../shared/updatable';
import { ContextEditComponent } from '../context-edit/context-edit.component';
import { DevelopmentMethodEntry } from '../../development-process-registry/development-method/development-method';
import { DevelopmentMethodIncompleteModalComponent } from '../development-method-incomplete-modal/development-method-incomplete-modal.component';
import { DevelopmentMethodService } from '../../development-process-registry/development-method/development-method.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProcessPatternEntry } from '../../development-process-registry/process-pattern/process-pattern';
import { RunningProcessContextEditSelectDecisionModalComponent } from '../running-process-context-edit-select-decision-modal/running-process-context-edit-select-decision-modal.component';
import { RunningProcessContextEditSelectDecisionModal } from '../running-process-context-edit-select-decision-modal/running-process-context-edit-select-decision-modal';
import { ProcessPatternIncompleteModalComponent } from '../process-pattern-incomplete-modal/process-pattern-incomplete-modal.component';
import { ProcessPatternService } from '../../development-process-registry/process-pattern/process-pattern.service';

@Component({
  selector: 'app-running-process-context-edit',
  templateUrl: './running-process-context-edit.component.html',
  styleUrls: ['./running-process-context-edit.component.css'],
  providers: [
    { provide: UPDATABLE, useExisting: RunningProcessContextEditComponent },
  ],
})
export class RunningProcessContextEditComponent implements Updatable {
  @Input() runningProcess!: ContextChangeRunningProcess;

  @ViewChild(BmProcessEditDiagramComponent)
  diagramComponent?: BmProcessEditDiagramComponent;
  @ViewChild(ContextEditComponent) contextEditComponent!: Updatable;

  constructor(
    private developmentMethodService: DevelopmentMethodService,
    private modalService: NgbModal,
    private processPatternService: ProcessPatternService,
    private runningProcessContextService: RunningProcessContextService
  ) {}

  async saveBmProcess(
    processDiagram: BmProcessDiagram,
    decisions?: { [elementId: string]: MethodDecision }
  ): Promise<void> {
    if (this.runningProcess != null) {
      await this.runningProcessContextService.saveBmProcessDiagram(
        this.runningProcess._id,
        processDiagram,
        decisions
      );
    }
  }

  async updateDomains(domains: Domain[]): Promise<void> {
    if (this.runningProcess != null) {
      await this.runningProcessContextService.updateDomains(
        this.runningProcess._id,
        domains
      );
    }
  }

  async updateSituationalFactors(
    situationalFactors: SelectionInit<SituationalFactorInit>[]
  ): Promise<void> {
    if (this.runningProcess != null) {
      await this.runningProcessContextService.updateSituationalFactors(
        this.runningProcess._id,
        situationalFactors
      );
    }
  }

  async appendProcessPattern(
    nodeId: string,
    processPattern: ProcessPatternEntry
  ): Promise<void> {
    if (this.runningProcess != null) {
      try {
        await this.runningProcessContextService.appendProcessPattern(
          this.runningProcess._id,
          processPattern._id,
          nodeId
        );
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === 'Process Pattern is not correctly defined'
        ) {
          const pattern = await this.processPatternService.get(
            processPattern._id
          );
          const modal = this.modalService.open(
            ProcessPatternIncompleteModalComponent
          );
          const component: ProcessPatternIncompleteModalComponent =
            modal.componentInstance;
          component.processPattern = pattern;
        } else {
          throw error;
        }
      }
    }
  }

  async insertProcessPattern(
    nodeId: string,
    processPattern: ProcessPatternEntry
  ): Promise<void> {
    if (this.runningProcess != null) {
      try {
        await this.runningProcessContextService.insertProcessPattern(
          this.runningProcess._id,
          processPattern._id,
          nodeId
        );
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === 'Process Pattern is not correctly defined'
        ) {
          const pattern = await this.processPatternService.get(
            processPattern._id
          );
          const modal = this.modalService.open(
            ProcessPatternIncompleteModalComponent
          );
          const component: ProcessPatternIncompleteModalComponent =
            modal.componentInstance;
          component.processPattern = pattern;
        } else {
          throw error;
        }
      }
    }
  }

  async deleteProcessPattern(nodeId: string): Promise<void> {
    if (this.runningProcess != null) {
      await this.runningProcessContextService.removeProcessPattern(
        this.runningProcess._id,
        nodeId
      );
    }
  }

  async insertDevelopmentMethod(
    nodeId: string,
    developmentMethod: DevelopmentMethodEntry
  ): Promise<void> {
    if (this.diagramComponent != null) {
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
          void this.runningProcessContextService.insertDecision(
            this.runningProcess._id,
            nodeId,
            event.id
          );
          modal.close();
        });
        this.diagramComponent.resetSelectDevelopmentMethodModal();
        return;
      }
      await this._insertDevelopmentMethod(nodeId, developmentMethod);
    }
  }

  private async _insertDevelopmentMethod(
    nodeId: string,
    developmentMethod: DevelopmentMethodEntry
  ): Promise<void> {
    if (this.diagramComponent != null) {
      try {
        await this.runningProcessContextService.insertDevelopmentMethod(
          this.runningProcess._id,
          nodeId,
          developmentMethod._id
        );
        this.diagramComponent.resetSelectDevelopmentMethodModal();
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
  }

  async removeDevelopmentMethod(nodeId: string): Promise<void> {
    if (this.runningProcess != null) {
      await this.runningProcessContextService.removeDevelopmentMethod(
        this.runningProcess._id,
        nodeId
      );
    }
  }

  async removeRemovedMethod(id: string): Promise<void> {
    await this.runningProcessContextService.removeRemovedMethod(
      this.runningProcess._id,
      id
    );
  }

  async update(): Promise<void> {
    this.contextEditComponent.update();
    // TODO check whether this correctly works
    await this.saveDiagram();
  }

  async diagramChanged(): Promise<boolean> {
    if (this.diagramComponent == null) {
      return false;
    }
    return this.diagramComponent.diagramChanged();
  }

  async saveDiagram(): Promise<void> {
    return this.diagramComponent?.saveDiagram();
  }
}
