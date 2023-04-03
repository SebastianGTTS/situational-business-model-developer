import { Component, Input, ViewChild } from '@angular/core';
import {
  RunningPatternProcess,
  RunningPatternProcessInit,
} from '../../../development-process-registry/running-process/running-pattern-process';
import { ProcessPatternEntry } from '../../../development-process-registry/process-pattern/process-pattern';
import { ProcessPatternIncompleteModalComponent } from '../../process-pattern/process-pattern-incomplete-modal/process-pattern-incomplete-modal.component';
import { RunningPatternProcessContextService } from '../../../development-process-registry/running-process/running-pattern-process-context.service';
import { ProcessPatternService } from '../../../development-process-registry/process-pattern/process-pattern.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DevelopmentMethodEntry } from '../../../development-process-registry/development-method/development-method';
import { RunningProcessContextEditSelectDecisionModalComponent } from '../running-process-context-edit-select-decision-modal/running-process-context-edit-select-decision-modal.component';
import { RunningProcessContextEditSelectDecisionModal } from '../running-process-context-edit-select-decision-modal/running-process-context-edit-select-decision-modal';
import { ContextChangeRunningProcess } from '../../../development-process-registry/running-process/running-full-process';
import { ContextChangeErrors } from '../../../development-process-registry/running-process/running-process-context.service';
import { DevelopmentMethodIncompleteModalComponent } from '../../development-method/development-method-incomplete-modal/development-method-incomplete-modal.component';
import { BmProcessEditDiagramComponent } from '../../bm-process/bm-process-edit-diagram/bm-process-edit-diagram.component';
import { DevelopmentMethodService } from '../../../development-process-registry/development-method/development-method.service';
import { BmProcessDiagram } from '../../../development-process-registry/bm-process/bm-pattern-process';
import { MethodDecision } from '../../../development-process-registry/bm-process/method-decision';
import { DiagramComponentInterface } from '../../shared/diagram-component-interface';
import { Updatable, UPDATABLE } from '../../../shared/updatable';
import { RunningProcessContextEditBaseComponent } from '../running-process-context-edit-base/running-process-context-edit-base.component';

@Component({
  selector: 'app-running-pattern-process-context-edit',
  templateUrl: './running-pattern-process-context-edit.component.html',
  styleUrls: ['./running-pattern-process-context-edit.component.css'],
  providers: [
    {
      provide: UPDATABLE,
      useExisting: RunningPatternProcessContextEditComponent,
    },
  ],
})
export class RunningPatternProcessContextEditComponent
  implements DiagramComponentInterface, Updatable
{
  @Input() runningProcess!: RunningPatternProcess & ContextChangeRunningProcess;

  @ViewChild(BmProcessEditDiagramComponent)
  diagramComponent?: BmProcessEditDiagramComponent;
  @ViewChild(RunningProcessContextEditBaseComponent)
  runningProcessContextEditBaseComponent?: RunningProcessContextEditBaseComponent<
    RunningPatternProcess,
    RunningPatternProcessInit
  >;

  constructor(
    private developmentMethodService: DevelopmentMethodService,
    private modalService: NgbModal,
    private processPatternService: ProcessPatternService,
    private runningPatternProcessContextService: RunningPatternProcessContextService
  ) {}

  async update(): Promise<void> {
    this.runningProcessContextEditBaseComponent?.update();
    await this.saveDiagram();
  }

  async saveBmProcess(
    processDiagram: BmProcessDiagram,
    decisions?: { [elementId: string]: MethodDecision }
  ): Promise<void> {
    await this.runningPatternProcessContextService.saveBmProcessDiagram(
      this.runningProcess._id,
      processDiagram,
      decisions
    );
  }

  async appendProcessPattern(
    nodeId: string,
    processPattern: ProcessPatternEntry
  ): Promise<void> {
    try {
      await this.runningPatternProcessContextService.appendProcessPattern(
        this.runningProcess._id,
        processPattern._id,
        nodeId
      );
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'Process Pattern is not correctly defined'
      ) {
        await this.handlePatternIncomplete(processPattern._id);
      } else {
        throw error;
      }
    }
  }

  async insertProcessPattern(
    nodeId: string,
    processPattern: ProcessPatternEntry
  ): Promise<void> {
    try {
      await this.runningPatternProcessContextService.insertProcessPattern(
        this.runningProcess._id,
        processPattern._id,
        nodeId
      );
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'Process Pattern is not correctly defined'
      ) {
        await this.handlePatternIncomplete(processPattern._id);
      } else {
        throw error;
      }
    }
  }

  private async handlePatternIncomplete(
    processPatternId: string
  ): Promise<void> {
    const pattern = await this.processPatternService.get(processPatternId);
    const modal = this.modalService.open(
      ProcessPatternIncompleteModalComponent
    );
    const component: ProcessPatternIncompleteModalComponent =
      modal.componentInstance;
    component.processPattern = pattern;
  }

  async deleteProcessPattern(nodeId: string): Promise<void> {
    await this.runningPatternProcessContextService.removeProcessPattern(
      this.runningProcess._id,
      nodeId
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
        void this.runningPatternProcessContextService.insertDecision(
          this.runningProcess._id,
          nodeId,
          event.id
        );
        modal.close();
      });
      this.diagramComponent?.resetSelectDevelopmentMethodModal();
      return;
    }
    await this._insertDevelopmentMethod(nodeId, developmentMethod);
  }

  private async _insertDevelopmentMethod(
    nodeId: string,
    developmentMethod: DevelopmentMethodEntry
  ): Promise<void> {
    try {
      await this.runningPatternProcessContextService.insertDevelopmentMethod(
        this.runningProcess._id,
        nodeId,
        developmentMethod._id
      );
      this.diagramComponent?.resetSelectDevelopmentMethodModal();
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
    await this.runningPatternProcessContextService.removeDevelopmentMethod(
      this.runningProcess._id,
      nodeId
    );
  }

  async diagramChanged(): Promise<boolean> {
    return this.diagramComponent?.diagramChanged() ?? false;
  }

  async saveDiagram(): Promise<void> {
    await this.diagramComponent?.saveDiagram();
  }
}
