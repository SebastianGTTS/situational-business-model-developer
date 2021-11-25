import { Component, ViewChild } from '@angular/core';
import { ProcessPatternService } from '../../development-process-registry/process-pattern/process-pattern.service';
import { DiagramComponentInterface } from '../shared/diagram-component-interface';
import { ProcessPatternDiagramComponent } from '../process-pattern-diagram/process-pattern-diagram.component';
import { ProcessPatternLoaderService } from '../shared/process-pattern-loader.service';

@Component({
  selector: 'app-process-pattern',
  templateUrl: './process-pattern.component.html',
  styleUrls: ['./process-pattern.component.css'],
  providers: [ProcessPatternLoaderService],
})
export class ProcessPatternComponent implements DiagramComponentInterface {
  @ViewChild(ProcessPatternDiagramComponent)
  diagramComponent: ProcessPatternDiagramComponent;

  constructor(
    private processPatternLoaderService: ProcessPatternLoaderService,
    private processPatternService: ProcessPatternService
  ) {}

  async save(pattern: string) {
    await this.processPatternService.update(this.processPattern._id, {
      pattern,
    });
  }

  async updateProcessPatternValue(value: any) {
    await this.processPatternService.update(this.processPattern._id, value);
  }

  diagramChanged(): Promise<boolean> {
    return this.diagramComponent.diagramChanged();
  }

  saveDiagram(): Promise<void> {
    return this.diagramComponent.saveDiagram();
  }

  get processPattern() {
    return this.processPatternLoaderService.processPattern;
  }
}
