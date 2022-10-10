import { Injectable } from '@angular/core';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import lintModule from 'bpmn-js-bpmnlint';
import bmdl from '../../../assets/bpmn_bmdl.json';
import { PatternDiagram, ProcessPattern } from './process-pattern';
import { BoxSizedElement, BpmnElement } from 'bpmn-js';
import { getBBox } from 'diagram-js/lib/util/Elements';
import * as BpmnUtils from '../bpmn/bpmn-utils';
import { ModelerService } from '../bpmn/modeler.service';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import { ProcessPatternLinterService } from './process-pattern-linter.service';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class ProcessPatternDiagramModelerService extends ModelerService {
  constructor(
    private processPatternLinterService: ProcessPatternLinterService
  ) {
    super();
  }

  /**
   * Get a BpmnModeler with customizations to support the development of process patterns
   *
   * @param processPattern the process pattern to initialize
   * @param linter whether to include the linter
   * @returns the bpmnModeler loaded with the ProcessPattern
   */
  async initModeling(
    processPattern?: ProcessPattern,
    linter = false
  ): Promise<BpmnModeler> {
    const processModeler = this.getProcessPatternModeler(linter);
    if (processPattern != null) {
      await processModeler.importXML(processPattern.pattern);
    } else {
      await processModeler.createDiagram();
    }
    return processModeler;
  }

  /**
   * Get the diagram of the ProcessPattern
   *
   * @param modeler
   */
  async getProcessPatternDiagram(
    modeler: BpmnModeler
  ): Promise<PatternDiagram> {
    const result = await modeler.saveXML();
    return result.xml;
  }

  /**
   * End the modeling and update the diagram of the ProcessPattern
   *
   * @param processPattern
   * @param modeler
   */
  async endModeling(
    processPattern: ProcessPattern,
    modeler: BpmnModeler
  ): Promise<void> {
    const result = await modeler.saveXML();
    processPattern.pattern = result.xml;
    modeler.destroy();
  }

  /**
   * Get a BpmnModeler with customizations to support the development of process patterns
   *
   * @param linter whether to include the linting module with the linting rules for process patterns
   * @returns a bpmnModeler
   */
  private getProcessPatternModeler(linter = false): BpmnModeler {
    if (linter) {
      return new BpmnModeler({
        linting: {
          bpmnlint: this.processPatternLinterService.getBpmnLinter(),
        },
        additionalModules: [lintModule],
        moddleExtensions: {
          bmdl,
        },
      });
    }
    return new BpmnModeler({
      additionalModules: [],
      moddleExtensions: {
        bmdl,
      },
    });
  }

  /**
   * Get the boundaries of the ProcessPattern loaded into the modeler
   *
   * @param modeler
   */
  getBoundaries(modeler: BpmnModeler): BoxSizedElement {
    return getBBox(
      modeler
        .get('elementRegistry')
        .filter((element) => !BpmnUtils.isProcess(element))
    );
  }

  /**
   * Get all FlowNodes and TextAnnotations of this process pattern
   *
   * @param modeler
   */
  getNodes(modeler: BpmnModeler): BpmnElement[] {
    return modeler
      .get('elementRegistry')
      .filter(
        (element) =>
          BpmnUtils.isFlowNode(element) || BpmnUtils.isTextAnnotation(element)
      );
  }

  /**
   * Get all connections, i.e., sequence flows and associations
   *
   * @param modeler
   */
  getConnections(modeler: BpmnModeler): BpmnElement[] {
    return modeler
      .get('elementRegistry')
      .filter(
        (element) =>
          BpmnUtils.isSequenceFlow(element) || BpmnUtils.isAssociation(element)
      );
  }
}
