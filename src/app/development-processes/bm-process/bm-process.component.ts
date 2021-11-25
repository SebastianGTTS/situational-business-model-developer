import { Component, OnInit, ViewChild } from '@angular/core';
import { BmProcessService } from '../../development-process-registry/bm-process/bm-process.service';
import { DiagramComponentInterface } from '../shared/diagram-component-interface';
import { BmProcessDiagramComponent } from '../bm-process-diagram/bm-process-diagram.component';
import { BmProcessLoaderService } from '../shared/bm-process-loader.service';

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

  ngOnInit() {
    this.bmProcessLoaderService.loaded.subscribe(() => {
      if (this.previousInitial === true && this.bmProcess.initial === false) {
        document.body.scrollIntoView({ behavior: 'smooth' });
      }
      this.previousInitial = this.bmProcess.initial;
    });
  }

  async finishInitialization() {
    await this.updateBmProcess({ initial: false });
  }

  async updateBmProcess(value: any) {
    await this.bmProcessService.update(this.bmProcess._id, value);
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

  get bmProcess() {
    return this.bmProcessLoaderService.bmProcess;
  }
}
