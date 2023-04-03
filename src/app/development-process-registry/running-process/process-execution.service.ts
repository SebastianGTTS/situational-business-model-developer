import { Injectable } from '@angular/core';
import { ProcessExecutionModelerService } from './process-execution-modeler.service';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import * as BpmnUtils from '../bpmn/bpmn-utils';
import { BpmnElement, BpmnFlowNode, BpmnSequenceFlow } from 'bpmn-js';
import { RunningPatternProcess } from './running-pattern-process';
import { ContextChangeRunningProcess } from './running-full-process';

export enum ExecutionErrors {
  MULTIPLE_OPTIONS = 'No outgoing flow selected for exclusive gateway.',
  NOT_ENOUGH_TOKENS = 'Element has not enough tokens to be executed.',
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
  async initRunningProcess(
    runningProcess: RunningPatternProcess
  ): Promise<void> {
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
    runningProcess: RunningPatternProcess,
    nodeId: string,
    flowId?: string
  ): Promise<void> {
    const modeler = await this.processExecutionModelerService.initModeling(
      runningProcess
    );
    const node = this.processExecutionModelerService.getNode(
      modeler,
      nodeId
    ) as BpmnFlowNode;
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
    modeler: BpmnModeler,
    node: BpmnFlowNode,
    flowId?: string
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
      targetFlows = [
        targetFlows.find((flow) => flow.id === flowId) as BpmnSequenceFlow,
      ];
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
    runningProcess: RunningPatternProcess,
    nodeId: string
  ): Promise<void> {
    const modeler = await this.processExecutionModelerService.initModeling(
      runningProcess
    );
    const node = this.processExecutionModelerService.getNode(
      modeler,
      nodeId
    ) as BpmnFlowNode;
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
   * Fake the execution of a method without updating the tokens.
   * Only possible for running processes in context change mode.
   *
   * @param runningProcess
   * @param nodeId
   */
  async fakeExecuteMethod(
    runningProcess: RunningPatternProcess & ContextChangeRunningProcess,
    nodeId: string
  ): Promise<void> {
    const modeler = await this.processExecutionModelerService.initModeling(
      runningProcess
    );
    const node = this.processExecutionModelerService.getNode(
      modeler,
      nodeId
    ) as BpmnFlowNode;
    if (
      !this.processExecutionModelerService.isExecutable(node) ||
      !runningProcess.isExecutable(nodeId)
    ) {
      throw new Error(ExecutionErrors.INCORRECT_NODE);
    }
    if (!this.hasEnoughTokens(node)) {
      this.processExecutionModelerService.setExecuted(modeler, node);
    }
    await this.processExecutionModelerService.endModeling(
      runningProcess,
      modeler
    );
  }

  /**
   * Remove that a method was executed.
   * Only possible for running processes in context change mode.
   *
   * @param runningProcess
   * @param nodeId
   */
  async removeExecutedMethod(
    runningProcess: RunningPatternProcess & ContextChangeRunningProcess,
    nodeId: string
  ): Promise<void> {
    const modeler = await this.processExecutionModelerService.initModeling(
      runningProcess
    );
    const node = this.processExecutionModelerService.getNode(
      modeler,
      nodeId
    ) as BpmnFlowNode;
    if (!this.processExecutionModelerService.isExecutable(node)) {
      throw new Error(ExecutionErrors.INCORRECT_NODE);
    }
    this.processExecutionModelerService.setExecuted(modeler, node, false);
    await this.processExecutionModelerService.endModeling(
      runningProcess,
      modeler
    );
  }

  /**
   * Set the execution to a specific position.
   *
   * @param runningProcess
   * @param nodeId
   */
  async setExecution(
    runningProcess: RunningPatternProcess & ContextChangeRunningProcess,
    nodeId: string
  ): Promise<void> {
    const modeler = await this.processExecutionModelerService.initModeling(
      runningProcess
    );
    const flows = this.processExecutionModelerService.getFlows(modeler);
    flows.forEach((flow) =>
      this.processExecutionModelerService.setUsed(modeler, flow, false)
    );
    const nodes = this.processExecutionModelerService.getNodes(modeler);
    nodes.forEach((node) => {
      if (
        this.processExecutionModelerService.isExecutable(node) &&
        runningProcess.isExecutable(node.id)
      ) {
        const executions = runningProcess.getExecutionsByNodeId(node.id);
        this.processExecutionModelerService.setExecuted(
          modeler,
          node,
          executions.length > 0
        );
      } else {
        this.processExecutionModelerService.setExecuted(modeler, node, false);
      }
      if (this.processExecutionModelerService.getTokens(node) > 0) {
        this.processExecutionModelerService.updateTokens(
          modeler,
          node,
          -this.processExecutionModelerService.getTokens(node)
        );
      }
    });
    const node = this.processExecutionModelerService.getNode(
      modeler,
      nodeId
    ) as BpmnFlowNode;
    this.processExecutionModelerService.setExecuted(modeler, node, false);
    this.processExecutionModelerService.updateTokens(
      modeler,
      node,
      this.getMinimumNeededTokens(node)
    );
    await this._jumpToNextMethod(modeler, runningProcess);
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
  async jumpToNextMethod(runningProcess: RunningPatternProcess): Promise<void> {
    const modeler = await this.processExecutionModelerService.initModeling(
      runningProcess
    );
    this._jumpToNextMethod(modeler, runningProcess);
    await this.processExecutionModelerService.endModeling(
      runningProcess,
      modeler
    );
  }

  /**
   * Jump until there are only methods to be executed
   *
   * @param modeler
   * @param runningProcess
   */
  private _jumpToNextMethod(
    modeler: BpmnModeler,
    runningProcess: Readonly<RunningPatternProcess>
  ): void {
    const ignoredIds = new Set<string>();
    const filterCommonNodes = (node: BpmnElement): boolean =>
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
          if (
            e instanceof Error &&
            e.message === ExecutionErrors.MULTIPLE_OPTIONS
          ) {
            ignoredIds.add(node.id);
          } else {
            throw e;
          }
        }
      }
    }
  }

  /**
   * Follow the flows to the next nodes
   *
   * @param modeler the current modeler
   * @param targetFlows the target flows
   */
  private followFlows(
    modeler: BpmnModeler,
    targetFlows: BpmnSequenceFlow[]
  ): void {
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
    runningProcess: RunningPatternProcess,
    nodeId: string
  ): Promise<boolean> {
    const modeler = await this.processExecutionModelerService.initModeling(
      runningProcess
    );
    const node = this.processExecutionModelerService.getNode(
      modeler,
      nodeId
    ) as BpmnFlowNode;
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
  async getExecutableNodes(
    runningProcess: RunningPatternProcess
  ): Promise<BpmnFlowNode[]> {
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
    runningProcess: RunningPatternProcess
  ): Promise<BpmnFlowNode[]> {
    const modeler = await this.processExecutionModelerService.initModeling(
      runningProcess
    );
    const nodes = this.processExecutionModelerService.filterNodes(
      modeler,
      (node) =>
        BpmnUtils.isFlowNode(node) &&
        this.hasEnoughTokens(node as BpmnFlowNode) &&
        this.processExecutionModelerService.isExclusiveGateway(node) &&
        this.processExecutionModelerService.getTargetFlows(node as BpmnFlowNode)
          .length > 1
    );
    this.processExecutionModelerService.abortModeling(modeler);
    return nodes as BpmnFlowNode[];
  }

  /**
   * Get all nodes that can be executed, i.e. have enough tokens and are not subprocesses
   *
   * @param modeler the modeler
   * @return the nodes that have enough tokens to be executed
   */
  private _getExecutableNodes(modeler: BpmnModeler): BpmnFlowNode[] {
    return this.processExecutionModelerService.filterNodes(
      modeler,
      (node) =>
        BpmnUtils.isFlowNode(node) &&
        !this.processExecutionModelerService.isSubProcess(node) &&
        this.hasEnoughTokens(node as BpmnFlowNode)
    ) as BpmnFlowNode[];
  }

  /**
   * Get all nodes that have tokens set
   *
   * @param runningProcess
   */
  async getTokenNodes(
    runningProcess: RunningPatternProcess
  ): Promise<{ [nodeId: string]: number }> {
    const modeler = await this.processExecutionModelerService.initModeling(
      runningProcess
    );
    const tokens: { [nodeId: string]: number } = {};
    this.processExecutionModelerService
      .filterNodes(modeler, (node) => BpmnUtils.isFlowNode(node))
      .map((node): [string, number] => [
        node.id,
        this.processExecutionModelerService.getTokens(node as BpmnFlowNode),
      ])
      .filter(([, token]) => token > 0)
      .forEach(([id, token]) => (tokens[id] = token));
    this.processExecutionModelerService.abortModeling(modeler);
    return tokens;
  }

  /**
   * Get the number of tokens needed to execute this node
   *
   * @param node the node to execute
   * @return number of tokens needed to execute the node
   */
  private getMinimumNeededTokens(node: BpmnFlowNode): number {
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
  private hasEnoughTokens(node: BpmnFlowNode): boolean {
    return (
      this.getMinimumNeededTokens(node) <=
      this.processExecutionModelerService.getTokens(node)
    );
  }
}
