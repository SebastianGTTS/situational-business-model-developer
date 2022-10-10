import { Injectable } from '@angular/core';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { BpmnElement } from 'bpmn-js';

@Injectable()
export class ModelerService {
  /**
   * Destroy the modeler
   *
   * @param modeler
   */
  abortModeling(modeler: BpmnModeler): void {
    modeler.destroy();
  }

  /**
   * Get a node from a node id
   *
   * @param modeler the modeler
   * @param nodeId the id of the node
   * @return the node
   */
  getNode(modeler: BpmnModeler, nodeId: string): BpmnElement {
    const node = modeler.get('elementRegistry').get(nodeId);
    if (node == null) {
      throw new Error('Element does not exist');
    }
    return node;
  }
}
