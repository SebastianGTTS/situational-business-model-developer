import { Component, OnInit, ViewChild } from '@angular/core';
import { ProcessPatternService } from '../../development-process-registry/process-pattern/process-pattern.service';
import { DiagramComponentInterface } from '../shared/diagram-component-interface';
import { ProcessPatternDiagramComponent } from '../process-pattern-diagram/process-pattern-diagram.component';
import { ProcessPatternLoaderService } from '../shared/process-pattern-loader.service';
import { ProcessPattern } from '../../development-process-registry/process-pattern/process-pattern';

@Component({
  selector: 'app-process-pattern',
  templateUrl: './process-pattern.component.html',
  styleUrls: ['./process-pattern.component.css'],
  providers: [ProcessPatternLoaderService],
})
export class ProcessPatternComponent
  implements OnInit, DiagramComponentInterface
{
  correctlyDefined = true;
  typesCorrectlyDefined = true;

  @ViewChild(ProcessPatternDiagramComponent)
  diagramComponent!: ProcessPatternDiagramComponent;

  constructor(
    private processPatternLoaderService: ProcessPatternLoaderService,
    private processPatternService: ProcessPatternService
  ) {}

  ngOnInit(): void {
    this.processPatternLoaderService.loaded.subscribe(async () => {
      if (this.processPattern != null) {
        this.correctlyDefined =
          await this.processPatternService.isCorrectlyDefined(
            this.processPattern
          );
        this.typesCorrectlyDefined = this.processPattern.types.length > 0;
      } else {
        this.correctlyDefined = true;
        this.typesCorrectlyDefined = true;
      }
    });
  }

  async save(pattern: string): Promise<void> {
    if (this.processPattern != null) {
      await this.processPatternService.update(this.processPattern._id, {
        pattern,
      });
    }
  }

  async updateProcessPatternValue(
    value: Partial<ProcessPattern>
  ): Promise<void> {
    if (this.processPattern != null) {
      await this.processPatternService.update(this.processPattern._id, value);
    }
  }

  diagramChanged(): Promise<boolean> {
    return this.diagramComponent.diagramChanged();
  }

  saveDiagram(): Promise<void> {
    return this.diagramComponent.saveDiagram();
  }

  get processPattern(): ProcessPattern | undefined {
    return this.processPatternLoaderService.processPattern;
  }
}
