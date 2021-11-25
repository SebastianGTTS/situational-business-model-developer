import { Injectable } from '@angular/core';
import bmdl from '../../../assets/bpmn_bmdl.json';
import rbmp from '../../../assets/bpmn_running_process.json';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { RunningProcess } from './running-process';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class ProcessExecutionModelerService {
  /**
   * Get a BpmnModeler with the imported running process
   *
   * @param runningProcess the running process to import
   * @return the bpmnModeler
   */
  async initModeling(runningProcess: RunningProcess): Promise<BpmnModeler> {
    const processModeler = this.getRunningProcessModeler();
    await processModeler.importXML(runningProcess.process.processDiagram);
    return processModeler;
  }

  /**
   * End the modeling and update the diagram of the running process
   *
   * @param runningProcess the running process to update
   * @param modeler the modeler
   */
  async endModeling(
    runningProcess: RunningProcess,
    modeler: BpmnModeler
  ): Promise<void> {
    const result = await modeler.saveXML();
    runningProcess.process.update({ processDiagram: result.xml });
    modeler.destroy();
  }

  /**
   * Destroy the modeler
   *
   * @param modeler the modeler
   */
  abortModeling(modeler: BpmnModeler) {
    modeler.destroy();
  }

  /**
   * Get a BpmnModeler with customizations to manage running processes
   *
   * @return a bpmnModeler
   */
  private getRunningProcessModeler(): BpmnModeler {
    return new BpmnModeler({
      additionalModules: [],
      moddleExtensions: {
        bmdl,
        rbmp,
      },
    });
  }

  /**
   * Filter nodes of the modeler
   *
   * @param modeler the modeler
   * @param filter the filter function
   * @return the list of the filtered nodes
   */
  filterNodes(modeler: BpmnModeler, filter: (node) => boolean): any[] {
    return modeler.get('elementRegistry').filter(filter);
  }

  /**
   * Get a node from a node id
   *
   * @param modeler the modeler
   * @param nodeId the id of the node
   * @return the node
   */
  getNode(modeler: BpmnModeler, nodeId: string): any {
    return modeler.get('elementRegistry').get(nodeId);
  }

  /**
   * Get the start event that has the process as a parent
   *
   * @param modeler the modeler
   * @return the start event node
   */
  getStartNode(modeler: BpmnModeler): any {
    return modeler
      .get('elementRegistry')
      .find(
        (node) => is(node, 'bpmn:StartEvent') && is(node.parent, 'bpmn:Process')
      );
  }

  /**
   * Get how many tokens this node stores
   *
   * @param node the node to check
   * @return the token count
   */
  getTokens(node): number {
    return node.businessObject.get('tokens');
  }

  /**
   * Get all incoming flows of a node
   *
   * @param node the node
   * @return the incoming flows
   */
  getIncomingFlows(node): any[] {
    return node.incoming;
  }

  /**
   * Get all target flows of a node, subprocess adjusted
   *
   * @param node the node
   * @return the target flows
   */
  getTargetFlows(node): any[] {
    let currentNode;
    let outgoingFlows;
    for (
      currentNode = node, outgoingFlows = currentNode.outgoing;
      outgoingFlows.length === 0;
      currentNode = currentNode.parent, outgoingFlows = currentNode.outgoing
    ) {
      if (is(currentNode.parent, 'bpmn:Process')) {
        return [];
      }
    }
    return outgoingFlows;
  }

  /**
   * Get the target node of a flow
   *
   * @param flow the flow to analyse
   * @return the target node
   */
  getTargetNode(flow): any {
    const target = flow.target;
    if (is(target, 'bpmn:SubProcess')) {
      return target.children.find((element) => is(element, 'bpmn:StartEvent'));
    }
    return target;
  }

  /**
   * Checks whether the node is a common node, i.e. a gateway or end or start event
   *
   * @param node the node to check
   * @return true if the node is a common node
   */
  isCommonNode(node): boolean {
    return (
      is(node, 'bpmn:StartEvent') ||
      is(node, 'bpmn:EndEvent') ||
      is(node, 'bpmn:ExclusiveGateway') ||
      is(node, 'bpmn:ParallelGateway')
    );
  }

  /**
   * Checks whether the node is an exclusive gateway
   *
   * @param node the node to check
   * @return true if the node is an exclusive gateway
   */
  isExclusiveGateway(node): boolean {
    return is(node, 'bpmn:ExclusiveGateway');
  }

  /**
   * Checks whether the node is a parallel gateway
   *
   * @param node the node to check
   * @return true if the node is a parallel gateway
   */
  isParallelGateway(node): boolean {
    return is(node, 'bpmn:ParallelGateway');
  }

  /**
   * Checks whether the node is executable, i.e. a task or method
   *
   * @param node the node to check
   * @return true if the node is executable
   */
  isExecutable(node): boolean {
    return is(node, 'bpmn:Task') || is(node, 'bpmn:CallActivity');
  }

  /**
   * Checks whether the node is a sub process
   *
   * @param node the node to check
   * @return true if the node is a sub process
   */
  isSubProcess(node): boolean {
    return is(node, 'bpmn:SubProcess');
  }

  /**
   * Set the node to executed
   *
   * @param modeler the modeler
   * @param node the node
   * @param value whether the node is executed or not
   */
  setExecuted(modeler: BpmnModeler, node, value: boolean = true): void {
    modeler.get('modeling').updateProperties(node, { executed: value });
  }

  /**
   * Set the flow to used
   *
   * @param modeler the modeler
   * @param flow the flow
   * @param value whether the flow is used or not
   */
  setUsed(modeler: BpmnModeler, flow, value: boolean = true): void {
    modeler.get('modeling').updateProperties(flow, { used: value });
  }

  /**
   * Update the token number
   *
   * @param modeler the modeler
   * @param node the node to update
   * @param delta the delta of tokens
   */
  updateTokens(modeler: BpmnModeler, node, delta: number): void {
    const modeling = modeler.get('modeling');
    let current = node;
    while (current && !is(current, 'bpmn:Process')) {
      modeling.updateProperties(current, {
        tokens: this.getTokens(current) + delta,
      });
      current = current.parent;
    }
  }
}
