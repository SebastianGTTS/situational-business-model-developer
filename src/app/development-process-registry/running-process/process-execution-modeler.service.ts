import { Injectable } from '@angular/core';
import bmdl from '../../../assets/bpmn_bmdl.json';
import rbmp from '../../../assets/bpmn_running_process.json';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { RunningPatternProcess } from './running-pattern-process';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import * as BpmnUtils from '../bpmn/bpmn-utils';
import {
  BpmnElement,
  BpmnFlowNode,
  BpmnSequenceFlow,
  BpmnSubProcess,
} from 'bpmn-js';
import { ModelerService } from '../bpmn/modeler.service';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class ProcessExecutionModelerService extends ModelerService {
  /**
   * Get a BpmnModeler with the imported running process
   *
   * @param runningProcess the running process to import
   * @return the bpmnModeler
   */
  async initModeling(
    runningProcess: RunningPatternProcess
  ): Promise<BpmnModeler> {
    const processModeler =
      ProcessExecutionModelerService.getRunningProcessModeler();
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
    runningProcess: RunningPatternProcess,
    modeler: BpmnModeler
  ): Promise<void> {
    const result = await modeler.saveXML();
    runningProcess.process.processDiagram = result.xml;
    modeler.destroy();
  }

  /**
   * Get a BpmnModeler with customizations to manage running processes
   *
   * @return a bpmnModeler
   */
  private static getRunningProcessModeler(): BpmnModeler {
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
  filterNodes(
    modeler: BpmnModeler,
    filter: (node: BpmnElement) => boolean
  ): BpmnElement[] {
    return modeler.get('elementRegistry').filter(filter);
  }

  /**
   * Get all nodes in the diagram
   *
   * @param modeler
   */
  getNodes(modeler: BpmnModeler): BpmnFlowNode[] {
    return modeler
      .get('elementRegistry')
      .filter((element: BpmnElement) => this.isNode(element)) as BpmnFlowNode[];
  }

  /**
   * Get all flows in the diagram
   *
   * @param modeler
   * @return all elements of type bpmn:SequenceFlow
   */
  getFlows(modeler: BpmnModeler): BpmnSequenceFlow[] {
    return modeler
      .get('elementRegistry')
      .filter((element: BpmnElement) =>
        this.isFlow(element)
      ) as BpmnSequenceFlow[];
  }

  /**
   * Get the start event that has the process as a parent
   *
   * @param modeler the modeler
   * @return the start event node
   */
  getStartNode(modeler: BpmnModeler): BpmnFlowNode {
    const node = modeler
      .get('elementRegistry')
      .find(
        (element: BpmnElement) =>
          BpmnUtils.isStartEvent(element) &&
          BpmnUtils.isProcess((element as BpmnFlowNode).parent)
      );
    if (node == null) {
      throw new Error('Element does not exist');
    }
    return node as BpmnFlowNode;
  }

  /**
   * Get how many tokens this node stores
   *
   * @param node the node to check
   * @return the token count
   */
  getTokens(node: BpmnFlowNode): number {
    return node.businessObject.get('tokens') as number;
  }

  /**
   * Get all incoming flows of a node
   *
   * @param node the node
   * @return the incoming flows
   */
  getIncomingFlows(node: BpmnFlowNode): BpmnSequenceFlow[] {
    return node.incoming;
  }

  /**
   * Get all target flows of a node, subprocess adjusted
   *
   * @param node the node
   * @return the target flows
   */
  getTargetFlows(node: BpmnFlowNode): BpmnSequenceFlow[] {
    let currentNode;
    let outgoingFlows;
    for (
      currentNode = node, outgoingFlows = currentNode.outgoing;
      outgoingFlows.length === 0;
      currentNode = currentNode.parent, outgoingFlows = currentNode.outgoing
    ) {
      if (BpmnUtils.isProcess(currentNode.parent)) {
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
  getTargetNode(flow: BpmnSequenceFlow): BpmnFlowNode {
    const target = flow.target;
    if (BpmnUtils.isSubProcess(target)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return (target as BpmnSubProcess).children.find((element) =>
        BpmnUtils.isStartEvent(element)
      )!;
    }
    return target;
  }

  /**
   * Checks whether the node is a common node, i.e. a gateway or end or start event
   *
   * @param node the node to check
   * @return true if the node is a common node
   */
  isCommonNode(node: BpmnElement): boolean {
    return (
      BpmnUtils.isStartEvent(node) ||
      BpmnUtils.isEndEvent(node) ||
      BpmnUtils.isExclusiveGateway(node) ||
      BpmnUtils.isParallelGateway(node)
    );
  }

  /**
   * Checks whether the node is an exclusive gateway
   *
   * @param node the node to check
   * @return true if the node is an exclusive gateway
   */
  isExclusiveGateway(node: BpmnElement): boolean {
    return BpmnUtils.isExclusiveGateway(node);
  }

  /**
   * Checks whether the node is a parallel gateway
   *
   * @param node the node to check
   * @return true if the node is a parallel gateway
   */
  isParallelGateway(node: BpmnElement): boolean {
    return BpmnUtils.isParallelGateway(node);
  }

  /**
   * Checks whether the node is executable, i.e. a task or method
   *
   * @param node the node to check
   * @return true if the node is executable
   */
  isExecutable(node: BpmnElement): boolean {
    return BpmnUtils.isTask(node) || BpmnUtils.isCallActivity(node);
  }

  /**
   * Checks whether the node is a sub process
   *
   * @param node the node to check
   * @return true if the node is a sub process
   */
  isSubProcess(node: BpmnElement): boolean {
    return BpmnUtils.isSubProcess(node);
  }

  /**
   * Checks whether the element is a flow element
   *
   * @param element
   * @return true if the element is a flow element
   */
  isFlow(element: BpmnElement): boolean {
    return BpmnUtils.isSequenceFlow(element);
  }

  /**
   * Checks whether the element is a node, i.e., an element where executed can be set
   *
   * @param element
   * @return true if it is a node
   */
  isNode(element: BpmnElement): boolean {
    return (
      this.isCommonNode(element) ||
      BpmnUtils.isTask(element) ||
      BpmnUtils.isCallActivity(element)
    );
  }

  /**
   * Set the node to executed
   *
   * @param modeler the modeler
   * @param node the node
   * @param value whether the node is executed or not
   */
  setExecuted(modeler: BpmnModeler, node: BpmnFlowNode, value = true): void {
    modeler.get('modeling').updateProperties(node, { executed: value });
  }

  /**
   * Set the flow to used
   *
   * @param modeler the modeler
   * @param flow the flow
   * @param value whether the flow is used or not
   */
  setUsed(modeler: BpmnModeler, flow: BpmnSequenceFlow, value = true): void {
    modeler.get('modeling').updateProperties(flow, { used: value });
  }

  /**
   * Update the token number
   *
   * @param modeler the modeler
   * @param node the node to update
   * @param delta the delta of tokens
   */
  updateTokens(modeler: BpmnModeler, node: BpmnFlowNode, delta: number): void {
    const modeling = modeler.get('modeling');
    let current = node;
    while (current && !BpmnUtils.isProcess(node)) {
      modeling.updateProperties(current, {
        tokens: this.getTokens(current) + delta,
      });
      current = current.parent;
    }
  }
}
