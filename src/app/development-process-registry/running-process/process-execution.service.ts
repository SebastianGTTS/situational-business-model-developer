import { Injectable } from '@angular/core';
import { RunningProcess } from './running-process';
import { ProcessExecutionModelerService } from './process-execution-modeler.service';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';

export enum ExecutionErrors {
  MULTIPLE_OPTIONS = 'No outgoing flow selected for exclusive gateway.',
  NOT_ENOUGH_TOKENS = 'Element has not enough tokens to be executed.',
  NODE_NOT_FOUND = 'Node not found',
  INCORRECT_NODE = 'Node can not be used with this method',
}

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class ProcessExecutionService {
  constructor(
    private processExecutionModelerService: ProcessExecutionModelerService
  ) {}

  /**
   * Initialize a running process and add the first token
   *
   * @param runningProcess the running process
   */
  async initRunningProcess(runningProcess: RunningProcess): Promise<void> {
    const modeler = await this.processExecutionModelerService.initModeling(
      runningProcess
    );
    const startNode = this.processExecutionModelerService.getStartNode(modeler);
    this.processExecutionModelerService.updateTokens(modeler, startNode, 1);
    await this.processExecutionModelerService.endModeling(
      runningProcess,
      modeler
    );
  }

  /**
   * Move to the next node from current node
   * Node has to be a common node, not a task or method
   *
   * @param runningProcess the running process
   * @param nodeId the id of the node
   * @param flowId the id of the flow to take if the node is a XOR node with multiple outgoing nodes
   */
  async moveToNextStep(
    runningProcess: RunningProcess,
    nodeId: string,
    flowId: string = null
  ): Promise<void> {
    const modeler = await this.processExecutionModelerService.initModeling(
      runningProcess
    );
    const node = this.processExecutionModelerService.getNode(modeler, nodeId);
    if (node == null) {
      throw new Error(ExecutionErrors.NODE_NOT_FOUND);
    }
    if (
      !this.processExecutionModelerService.isCommonNode(node) &&
      runningProcess.isExecutable(nodeId)
    ) {
      throw new Error(ExecutionErrors.INCORRECT_NODE);
    }
    this._moveToNextStep(modeler, node, flowId);
    await this.processExecutionModelerService.endModeling(
      runningProcess,
      modeler
    );
  }

  /**
   * Move to the next node from current node
   * Node has to be a common node, not a task or method
   *
   * @param modeler the modeler
   * @param node the node
   * @param flowId the id of the flow to take if the node is a XOR node with multiple outgoing nodes
   */
  private _moveToNextStep(
    modeler: any,
    node: any,
    flowId: string = null
  ): void {
    if (!this.hasEnoughTokens(node)) {
      throw new Error(ExecutionErrors.NOT_ENOUGH_TOKENS);
    }
    let targetFlows = this.processExecutionModelerService.getTargetFlows(node);
    if (
      this.processExecutionModelerService.isExclusiveGateway(node) &&
      targetFlows.length > 1 &&
      (flowId == null || !targetFlows.map((flow) => flow.id).includes(flowId))
    ) {
      throw new Error(ExecutionErrors.MULTIPLE_OPTIONS);
    }
    if (
      this.processExecutionModelerService.isExclusiveGateway(node) &&
      targetFlows.length > 1 &&
      flowId != null
    ) {
      targetFlows = [targetFlows.find((flow) => flow.id === flowId)];
    }
    this.processExecutionModelerService.setExecuted(modeler, node);
    this.followFlows(modeler, targetFlows);
    this.processExecutionModelerService.updateTokens(
      modeler,
      node,
      -this.getMinimumNeededTokens(node)
    );
  }

  /**
   * Move to the next node after the execution of a method
   *
   * @param runningProcess the running process
   * @param nodeId the id of the node
   */
  async moveToNextMethod(
    runningProcess: RunningProcess,
    nodeId: string
  ): Promise<void> {
    const modeler = await this.processExecutionModelerService.initModeling(
      runningProcess
    );
    const node = this.processExecutionModelerService.getNode(modeler, nodeId);
    if (node == null) {
      throw new Error(ExecutionErrors.NODE_NOT_FOUND);
    }
    if (
      !this.processExecutionModelerService.isExecutable(node) ||
      !runningProcess.isExecutable(nodeId)
    ) {
      throw new Error(ExecutionErrors.INCORRECT_NODE);
    }
    this.processExecutionModelerService.setExecuted(modeler, node);
    const targetFlows =
      this.processExecutionModelerService.getTargetFlows(node);
    this.followFlows(modeler, targetFlows);
    this.processExecutionModelerService.updateTokens(
      modeler,
      node,
      -this.getMinimumNeededTokens(node)
    );
    await this.processExecutionModelerService.endModeling(
      runningProcess,
      modeler
    );
  }

  /**
   * Jump until there are only methods to be executed
   *
   * @param runningProcess the running process
   */
  async jumpToNextMethod(runningProcess: RunningProcess): Promise<void> {
    const modeler = await this.processExecutionModelerService.initModeling(
      runningProcess
    );
    const ignoredIds = new Set<string>();
    const filterCommonNodes = (node): boolean =>
      !ignoredIds.has(node.id) &&
      (this.processExecutionModelerService.isCommonNode(node) ||
        (!runningProcess.isExecutable(node.id) &&
          this.processExecutionModelerService.isExecutable(node)));
    for (
      let nodes = this._getExecutableNodes(modeler).filter(filterCommonNodes);
      nodes.length > 0;
      nodes = this._getExecutableNodes(modeler).filter(filterCommonNodes)
    ) {
      for (const node of nodes) {
        try {
          this._moveToNextStep(modeler, node);
        } catch (e) {
          if (e.message === ExecutionErrors.MULTIPLE_OPTIONS) {
            ignoredIds.add(node.id);
          } else {
            throw e;
          }
        }
      }
    }
    await this.processExecutionModelerService.endModeling(
      runningProcess,
      modeler
    );
  }

  /**
   * Follow the flows to the next nodes
   *
   * @param modeler the current modeler
   * @param targetFlows the target flows
   */
  private followFlows(modeler: any, targetFlows: any[]): void {
    targetFlows.forEach((flow) =>
      this.processExecutionModelerService.setUsed(modeler, flow)
    );
    const targets = targetFlows.map(
      this.processExecutionModelerService.getTargetNode
    );
    targets.forEach((target) => {
      this.processExecutionModelerService.setExecuted(modeler, target, false);
      this.processExecutionModelerService.updateTokens(modeler, target, 1);
    });
  }

  /**
   * Check whether it is possible to execute the node
   *
   * @param runningProcess the running process
   * @param nodeId the id of the node to execute
   * @return true if the node can be executed
   */
  async canExecuteNode(
    runningProcess: RunningProcess,
    nodeId: string
  ): Promise<boolean> {
    const modeler = await this.processExecutionModelerService.initModeling(
      runningProcess
    );
    const node = this.processExecutionModelerService.getNode(modeler, nodeId);
    if (node == null) {
      throw new Error(ExecutionErrors.NODE_NOT_FOUND);
    }
    if (
      !this.processExecutionModelerService.isExecutable(node) ||
      !runningProcess.isExecutable(nodeId)
    ) {
      throw new Error(ExecutionErrors.INCORRECT_NODE);
    }
    if (!this.hasEnoughTokens(node)) {
      throw new Error(ExecutionErrors.NOT_ENOUGH_TOKENS);
    }
    this.processExecutionModelerService.abortModeling(modeler);
    return true;
  }

  /**
   * Get all nodes that can be executed, i.e. have enough tokens and are not subprocesses
   *
   * @param runningProcess the running process
   * @return the nodes that have enough tokens to be executed
   */
  async getExecutableNodes(runningProcess: RunningProcess): Promise<any[]> {
    const modeler = await this.processExecutionModelerService.initModeling(
      runningProcess
    );
    const nodes = this._getExecutableNodes(modeler);
    this.processExecutionModelerService.abortModeling(modeler);
    return nodes;
  }

  /**
   * Get all decision nodes that are executable and need a decision
   *
   * @param runningProcess the running process
   * @return the decision nodes
   */
  async getExecutableDecisionNodes(
    runningProcess: RunningProcess
  ): Promise<any[]> {
    const modeler = await this.processExecutionModelerService.initModeling(
      runningProcess
    );
    const nodes = this.processExecutionModelerService.filterNodes(
      modeler,
      (node) =>
        this.hasEnoughTokens(node) &&
        this.processExecutionModelerService.isExclusiveGateway(node) &&
        this.processExecutionModelerService.getTargetFlows(node).length > 1
    );
    this.processExecutionModelerService.abortModeling(modeler);
    return nodes;
  }

  /**
   * Get all nodes that can be executed, i.e. have enough tokens and are not subprocesses
   *
   * @param modeler the modeler
   * @return the nodes that have enough tokens to be executed
   */
  private _getExecutableNodes(modeler: any): any[] {
    return this.processExecutionModelerService.filterNodes(
      modeler,
      (node) =>
        !this.processExecutionModelerService.isSubProcess(node) &&
        this.hasEnoughTokens(node)
    );
  }

  /**
   * Get the number of tokens needed to execute this node
   *
   * @param node the node to execute
   * @return number of tokens needed to execute the node
   */
  private getMinimumNeededTokens(node): number {
    if (
      this.processExecutionModelerService.isParallelGateway(node) ||
      this.processExecutionModelerService.isExecutable(node)
    ) {
      return this.processExecutionModelerService.getIncomingFlows(node).length;
    }
    return 1;
  }

  /**
   * Checks whether a node has enough tokens to be executed
   *
   * @param node the node to execute
   * @return true if the node has enough tokens to be executed
   */
  private hasEnoughTokens(node): boolean {
    return (
      this.getMinimumNeededTokens(node) <=
      this.processExecutionModelerService.getTokens(node)
    );
  }
}
