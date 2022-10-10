import { Component, OnInit, ViewChild } from '@angular/core';
import { BmProcessService } from '../../development-process-registry/bm-process/bm-process.service';
import { DiagramComponentInterface } from '../shared/diagram-component-interface';
import { BmProcessEditDiagramComponent } from '../bm-process-edit-diagram/bm-process-edit-diagram.component';
import { BmProcessLoaderService } from '../shared/bm-process-loader.service';
import { BmProcess } from '../../development-process-registry/bm-process/bm-process';
import { Domain } from '../../development-process-registry/knowledge/domain';
import { SelectionInit } from '../../development-process-registry/development-method/selection';
import { SituationalFactorInit } from '../../development-process-registry/method-elements/situational-factor/situational-factor';
import { MethodDecision } from '../../development-process-registry/bm-process/method-decision';
import { ProcessPatternEntry } from '../../development-process-registry/process-pattern/process-pattern';
import { DevelopmentMethodEntry } from '../../development-process-registry/development-method/development-method';
import { DevelopmentMethodIncompleteModalComponent } from '../development-method-incomplete-modal/development-method-incomplete-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DevelopmentMethodService } from '../../development-process-registry/development-method/development-method.service';
import { ProcessPatternService } from '../../development-process-registry/process-pattern/process-pattern.service';
import { ProcessPatternIncompleteModalComponent } from '../process-pattern-incomplete-modal/process-pattern-incomplete-modal.component';

@Component({
  selector: 'app-bm-process',
  templateUrl: './bm-process.component.html',
  styleUrls: ['./bm-process.component.css'],
  providers: [BmProcessLoaderService],
})
export class BmProcessComponent implements OnInit, DiagramComponentInterface {
  @ViewChild(BmProcessEditDiagramComponent)
  diagramComponent!: BmProcessEditDiagramComponent;

  private previousInitial?: boolean;

  constructor(
    private bmProcessLoaderService: BmProcessLoaderService,
    private bmProcessService: BmProcessService,
    private developmentMethodService: DevelopmentMethodService,
    private modalService: NgbModal,
    private processPatternService: ProcessPatternService
  ) {}

  ngOnInit(): void {
    this.bmProcessLoaderService.loaded.subscribe(() => {
      if (
        this.previousInitial != null &&
        this.previousInitial &&
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        !this.bmProcess!.initial
      ) {
        document.body.scrollIntoView({ behavior: 'smooth' });
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.previousInitial = this.bmProcess!.initial;
    });
  }

  async finishInitialization(): Promise<void> {
    if (this.bmProcess != null) {
      await this.bmProcessService.finishInitialization(this.bmProcess._id);
    }
  }

  async updateDomains(domains: Domain[]): Promise<void> {
    if (this.bmProcess != null) {
      await this.bmProcessService.updateDomains(this.bmProcess._id, domains);
    }
  }

  async updateSituationalFactors(
    situationalFactors: SelectionInit<SituationalFactorInit>[]
  ): Promise<void> {
    if (this.bmProcess != null) {
      await this.bmProcessService.updateSituationalFactors(
        this.bmProcess._id,
        situationalFactors
      );
    }
  }

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

  get bmProcess(): BmProcess | undefined {
    return this.bmProcessLoaderService.bmProcess;
  }
}
