import { Component, ViewChild } from '@angular/core';
import { DiagramComponentInterface } from '../../shared/diagram-component-interface';
import { ProcessPatternDiagramComponent } from '../process-pattern-diagram/process-pattern-diagram.component';
import { ProcessPattern } from '../../../development-process-registry/process-pattern/process-pattern';
import { ProcessPatternLoaderService } from '../../shared/process-pattern-loader.service';
import { ProcessPatternService } from '../../../development-process-registry/process-pattern/process-pattern.service';

@Component({
  selector: 'app-process-pattern-pattern',
  templateUrl: './process-pattern-pattern.component.html',
  styleUrls: ['./process-pattern-pattern.component.scss'],
})
export class ProcessPatternPatternComponent
  implements DiagramComponentInterface
{
  @ViewChild(ProcessPatternDiagramComponent)
  diagramComponent?: ProcessPatternDiagramComponent;

  constructor(
    private processPatternLoaderService: ProcessPatternLoaderService,
    private processPatternService: ProcessPatternService
  ) {}

  async save(pattern: string): Promise<void> {
    if (this.processPattern != null) {
      await this.processPatternService.update(this.processPattern._id, {
        pattern,
      });
    }
  }

  async diagramChanged(): Promise<boolean> {
    return this.diagramComponent?.diagramChanged() ?? false;
  }

  async saveDiagram(): Promise<void> {
    return this.diagramComponent?.saveDiagram();
  }

  get processPattern(): ProcessPattern | undefined {
    return this.processPatternLoaderService.processPattern;
  }
}
