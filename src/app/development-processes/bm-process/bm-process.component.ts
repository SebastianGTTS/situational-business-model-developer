import { Component, OnInit, ViewChild } from '@angular/core';
import { BmProcessService } from '../../development-process-registry/bm-process/bm-process.service';
import { DiagramComponentInterface } from '../shared/diagram-component-interface';
import { BmProcessDiagramComponent } from '../bm-process-diagram/bm-process-diagram.component';
import { BmProcessLoaderService } from '../shared/bm-process-loader.service';
import { BmProcess } from '../../development-process-registry/bm-process/bm-process';
import { Domain } from '../../development-process-registry/knowledge/domain';
import { SelectionInit } from '../../development-process-registry/development-method/selection';
import { SituationalFactorInit } from '../../development-process-registry/method-elements/situational-factor/situational-factor';
import { Decision } from '../../development-process-registry/bm-process/decision';

@Component({
  selector: 'app-bm-process',
  templateUrl: './bm-process.component.html',
  styleUrls: ['./bm-process.component.css'],
  providers: [BmProcessLoaderService],
})
export class BmProcessComponent implements OnInit, DiagramComponentInterface {
  @ViewChild(BmProcessDiagramComponent)
  diagramComponent: BmProcessDiagramComponent;

  private previousInitial = null;

  constructor(
    private bmProcessLoaderService: BmProcessLoaderService,
    private bmProcessService: BmProcessService
  ) {}

  ngOnInit(): void {
    this.bmProcessLoaderService.loaded.subscribe(() => {
      if (this.previousInitial === true && this.bmProcess.initial === false) {
        document.body.scrollIntoView({ behavior: 'smooth' });
      }
      this.previousInitial = this.bmProcess.initial;
    });
  }

  async finishInitialization(): Promise<void> {
    await this.bmProcessService.finishInitialization(this.bmProcess._id);
  }

  async updateDomains(domains: Domain[]): Promise<void> {
    await this.bmProcessService.updateDomains(this.bmProcess._id, domains);
  }

  async updateSituationalFactors(
    situationalFactors: SelectionInit<SituationalFactorInit>[]
  ): Promise<void> {
    await this.bmProcessService.updateSituationalFactors(
      this.bmProcess._id,
      situationalFactors
    );
  }

  async saveBmProcess(
    processDiagram: string,
    decisions?: { [elementId: string]: Decision }
  ): Promise<void> {
    await this.bmProcessService.saveBmProcessDiagram(
      this.bmProcess._id,
      processDiagram,
      decisions
    );
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

  get bmProcess(): BmProcess {
    return this.bmProcessLoaderService.bmProcess;
  }
}
