import { Injectable } from '@angular/core';
import { PatternDiagram, ProcessPattern } from './process-pattern';
import { ProcessPatternDiagramModelerService } from './process-pattern-diagram-modeler.service';

@Injectable({
  providedIn: 'root',
})
export class ProcessPatternDiagramService {
  constructor(
    private processPatternDiagramModelerService: ProcessPatternDiagramModelerService
  ) {}

  async getEmptyProcessPatternDiagram(): Promise<PatternDiagram> {
    const modeler =
      await this.processPatternDiagramModelerService.initModeling();
    const result =
      await this.processPatternDiagramModelerService.getProcessPatternDiagram(
        modeler
      );
    this.processPatternDiagramModelerService.abortModeling(modeler);
    return result;
  }

  /**
   * Check whether a process pattern fulfills the linting rules of BPMN
   *
   * @param processPattern
   */
  async isCorrectlyDefined(processPattern: ProcessPattern): Promise<boolean> {
    const modeler = await this.processPatternDiagramModelerService.initModeling(
      processPattern,
      true
    );
    const result = await modeler.get('linting').lint();
    const correct = Object.values(result).every((category) =>
      category.every((item) => item.category !== 'error')
    );
    await this.processPatternDiagramModelerService.abortModeling(modeler);
    return correct;
  }
}
