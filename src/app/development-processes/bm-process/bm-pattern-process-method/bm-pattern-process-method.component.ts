import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BmPatternProcess } from 'src/app/development-process-registry/bm-process/bm-pattern-process';
import { BmPatternProcessService } from 'src/app/development-process-registry/bm-process/bm-pattern-process.service';
import { MethodDecision } from 'src/app/development-process-registry/bm-process/method-decision';
import { DevelopmentMethodEntry } from 'src/app/development-process-registry/development-method/development-method';
import { DevelopmentMethodService } from 'src/app/development-process-registry/development-method/development-method.service';
import { ProcessPatternEntry } from 'src/app/development-process-registry/process-pattern/process-pattern';
import { ProcessPatternService } from 'src/app/development-process-registry/process-pattern/process-pattern.service';
import { BmProcessEditDiagramComponent } from '../bm-process-edit-diagram/bm-process-edit-diagram.component';
import { DevelopmentMethodIncompleteModalComponent } from '../../development-method/development-method-incomplete-modal/development-method-incomplete-modal.component';
import { ProcessPatternIncompleteModalComponent } from '../../process-pattern/process-pattern-incomplete-modal/process-pattern-incomplete-modal.component';
import { BmProcessLoaderService } from '../../shared/bm-process-loader.service';
import { DiagramComponentInterface } from '../../shared/diagram-component-interface';

@Component({
  selector: 'app-bm-pattern-process-method',
  templateUrl: './bm-pattern-process-method.component.html',
  styleUrls: ['./bm-pattern-process-method.component.scss'],
})
export class BmPatternProcessMethodComponent
  implements DiagramComponentInterface
{
  @ViewChild(BmProcessEditDiagramComponent)
  diagramComponent!: BmProcessEditDiagramComponent;

  constructor(
    private bmProcessLoaderService: BmProcessLoaderService,
    private bmProcessService: BmPatternProcessService,
    private developmentMethodService: DevelopmentMethodService,
    private modalService: NgbModal,
    private processPatternService: ProcessPatternService
  ) {}

  async saveBmProcess(
    processDiagram: string,
    decisions?: { [elementId: string]: MethodDecision }
  ): Promise<void> {
    if (this.bmProcess != null) {
      await this.bmProcessService.saveBmProcessDiagram(
        this.bmProcess._id,
        processDiagram,
        decisions
      );
    }
  }

  async appendProcessPattern(
    nodeId: string,
    processPattern: ProcessPatternEntry
  ): Promise<void> {
    if (this.bmProcess != null) {
      try {
        await this.bmProcessService.appendProcessPattern(
          this.bmProcess._id,
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
    if (this.bmProcess != null) {
      try {
        await this.bmProcessService.insertProcessPattern(
          this.bmProcess._id,
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
    if (this.bmProcess != null) {
      await this.bmProcessService.removeProcessPattern(
        this.bmProcess._id,
        nodeId
      );
    }
  }

  async insertDevelopmentMethod(
    nodeId: string,
    developmentMethod: DevelopmentMethodEntry
  ): Promise<void> {
    if (this.bmProcess != null) {
      try {
        await this.bmProcessService.insertDevelopmentMethod(
          this.bmProcess._id,
          nodeId,
          developmentMethod._id
        );
        this.diagramComponent.resetSelectDevelopmentMethodModal();
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

  async removeDevelopmentMethod(nodeId: string): Promise<void> {
    if (this.bmProcess != null) {
      await this.bmProcessService.removeDevelopmentMethod(
        this.bmProcess._id,
        nodeId
      );
    }
  }

  async diagramChanged(): Promise<boolean> {
    if (this.diagramComponent == null) {
      return false;
    }
    return this.diagramComponent.diagramChanged();
  }

  saveDiagram(): Promise<void> {
    return this.diagramComponent.saveDiagram();
  }

  get bmProcess(): BmPatternProcess | undefined {
    return this.bmProcessLoaderService.bmPatternProcess;
  }
}
