import { MethodDecision } from './method-decision';
import { Artifact } from '../method-elements/artifact/artifact';
import * as BpmnUtils from '../bpmn/bpmn-utils';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import {
  BpmnElement,
  BpmnElementRegistry,
  BpmnFlowNode,
  BpmnSequenceFlow,
  BpmnSubProcess,
} from 'bpmn-js';

interface MissingArtifactsNode {
  node: BpmnFlowNode;
  missingArtifacts: Artifact[] | null;
}

/**
 * Nodes are included if there are missing artifacts or can not be reached.
 * If a node is unreachable missing artifacts is set to null.
 */
export type MissingArtifactsNodesList = MissingArtifactsNode[];

export class BmProcessDiagramArtifacts {
  private readonly elementRegistry: BpmnElementRegistry;
  private readonly decisions: { [elementId: string]: MethodDecision };

  private visitedNodes = new Set<BpmnFlowNode>();
  private artifacts: { [elementId: string]: Artifact[] } = {};
  private currentNodes: BpmnFlowNode[] = [];
  private tokens?: { [nodeId: string]: number };

  private missingMap: { [nodeId: string]: MissingArtifactsNode } = {};

  constructor(
    modeler: BpmnModeler,
    decisions: { [elementId: string]: MethodDecision }
  ) {
    this.elementRegistry = modeler.get('elementRegistry');
    this.decisions = decisions;
  }

  /**
   * Checks whether all artifacts are present and which nodes can be reached
   *
   * @param startingElements the nodes from where to start the checking.
   * Defaults to the start event of the most outer process
   * @param tokenNodes a map that maps node ids to tokens
   * @param artifacts the artifacts that are already given
   * @return A map of elementIds with the missing artifacts or null if the node can not be reached
   */
  checkArtifacts(
    startingElements?: Set<string>,
    tokenNodes?: { [nodeId: string]: number },
    artifacts?: Artifact[]
  ): MissingArtifactsNodesList {
    const fixedStart: Set<string> = new Set<string>();
    if (startingElements == null || tokenNodes == null) {
      const start = this.elementRegistry.find(
        (element: BpmnElement) =>
          BpmnUtils.isStartEvent(element) &&
          BpmnUtils.isProcess((element as BpmnFlowNode).parent)
      ) as BpmnFlowNode;
      this.currentNodes.push(start);
      fixedStart.add(start.id);
    } else {
      const start = this.elementRegistry.filter((element) =>
        startingElements.has(element.id)
      ) as BpmnFlowNode[];
      this.currentNodes.push(...start);
      start.forEach((element) => fixedStart.add(element.id));
      Object.keys(tokenNodes).forEach((nodeId) => fixedStart.add(nodeId));
      this.tokens = tokenNodes;
    }
    while (this.currentNodes.length > 0) {
      const currentNode = this.currentNodes[0];
      this.currentNodes.splice(0, 1);
      if (!fixedStart.has(currentNode.id)) {
        this.handleCurrentNode(currentNode);
      } else if (!this.visitedNodes.has(currentNode)) {
        this.handleCurrentNode(currentNode, artifacts);
      }
    }
    this.getAllUnreachedNodes().forEach(
      (element) =>
        (this.missingMap[element.id] = {
          node: element,
          missingArtifacts: null,
        })
    );
    return Object.entries(this.missingMap).map(
      ([, missingArtifactsNode]) => missingArtifactsNode
    );
  }

  private handleCurrentNode(
    currentNode: BpmnFlowNode,
    artifacts?: Artifact[]
  ): void {
    let incomingArtifacts;
    if (BpmnUtils.isParallelGateway(currentNode)) {
      incomingArtifacts = this.getIncomingArtifactsUnion(currentNode);
      if (incomingArtifacts == null) {
        return;
      }
    } else if (BpmnUtils.isExclusiveGateway(currentNode)) {
      incomingArtifacts = this.getIncomingArtifactsIntersect(currentNode);
    } else {
      incomingArtifacts = this.getIncomingArtifacts(currentNode);
    }
    if (artifacts != null) {
      incomingArtifacts.push(...artifacts);
    }
    let newNode = false;
    if (!this.visitedNodes.has(currentNode)) {
      this.visitedNodes.add(currentNode);
      newNode = true;
    }
    const incomingArtifactIds = incomingArtifacts.map(
      (artifact) => artifact._id
    );
    const neededArtifacts = this.getNeededArtifacts(currentNode);
    const missing = neededArtifacts.filter(
      (artifact) => !incomingArtifactIds.includes(artifact._id)
    );
    if (missing.length > 0) {
      this.missingMap[currentNode.id] = {
        node: currentNode,
        missingArtifacts: missing,
      };
    }
    const previousArtifactIds =
      currentNode.id in this.artifacts
        ? this.artifacts[currentNode.id].map((artifact) => artifact._id)
        : undefined;
    this.artifacts[currentNode.id] = [
      ...incomingArtifacts,
      ...this.getCreatedArtifacts(currentNode),
    ];
    const currentArtifactIds = this.artifacts[currentNode.id].map(
      (artifact) => artifact._id
    );
    if (previousArtifactIds != null) {
      const unchanged: boolean =
        currentArtifactIds.every((id) => previousArtifactIds.includes(id)) &&
        previousArtifactIds.every((id) => currentArtifactIds.includes(id));
      if (unchanged && !newNode) {
        return;
      }
    }
    this.currentNodes.push(...this.getTargets(currentNode));
  }

  private getAllUnreachedNodes(): BpmnFlowNode[] {
    return this.elementRegistry.filter(
      (element: BpmnElement) =>
        BpmnUtils.isFlowNode(element) &&
        !this.visitedNodes.has(element as BpmnFlowNode) &&
        !BpmnUtils.isSubProcess(element)
    ) as BpmnFlowNode[];
  }

  private getNeededArtifacts(element: BpmnElement): Artifact[] {
    return this.getDecisionArtifacts(element, true);
  }

  private getCreatedArtifacts(element: BpmnElement): Artifact[] {
    return this.getDecisionArtifacts(element, false);
  }

  private getDecisionArtifacts(
    element: BpmnElement,
    input = false
  ): Artifact[] {
    if (element.id in this.decisions) {
      const decision = this.decisions[element.id];
      const decisionArtifacts = input
        ? decision.inputArtifacts
        : decision.outputArtifacts;
      return decisionArtifacts
        .getSelectedElementsOptional()
        .filter((elementOptional) => (input ? !elementOptional.optional : true))
        .map((elementOptional) => elementOptional.element);
    }
    return [];
  }

  private getIncomingArtifactsUnion(
    element: BpmnFlowNode
  ): Artifact[] | undefined {
    const artifacts: Artifact[] = [];
    const sources = this.getSources(element);
    if (
      sources.filter((source) => !(source.id in this.artifacts)).length >
      (this.tokens?.[element.id] ?? 0)
    ) {
      return undefined;
    }
    sources.forEach((source) => artifacts.push(...this.getArtifacts(source)));
    return artifacts;
  }

  private getIncomingArtifactsIntersect(element: BpmnFlowNode): Artifact[] {
    const artifacts: Artifact[][] = [];
    const sources = this.getSources(element);
    if (sources.length === 0) {
      return [];
    }
    sources
      .filter((source) => source.id in this.artifacts)
      .forEach((source) => artifacts.push(this.getArtifacts(source)));
    const others: string[][] = artifacts.map((group) =>
      group.map((artifact) => artifact._id)
    );
    others.slice(0, 1);
    let resultingArtifacts: Artifact[] = artifacts[0] ?? [];
    others.forEach(
      (group) =>
        (resultingArtifacts = resultingArtifacts.filter((artifact) =>
          group.includes(artifact._id)
        ))
    );
    return resultingArtifacts;
  }

  private getIncomingArtifacts(element: BpmnFlowNode): Artifact[] {
    const artifacts: Artifact[] = [];
    const sources = this.getSources(element);
    sources.forEach((source) => artifacts.push(...this.getArtifacts(source)));
    return artifacts;
  }

  private getArtifacts(element: BpmnElement): Artifact[] {
    if (element.id in this.artifacts) {
      return this.artifacts[element.id];
    }
    return [];
  }

  private getSources(element: BpmnFlowNode): BpmnFlowNode[] {
    let node: BpmnFlowNode;
    let incomingFlows: BpmnSequenceFlow[];
    for (
      node = element, incomingFlows = node.incoming;
      incomingFlows.length === 0;
      node = node.parent, incomingFlows = node.incoming
    ) {
      if (BpmnUtils.isProcess(node.parent)) {
        return [];
      }
    }
    return incomingFlows
      .map((flow) => flow.source)
      .map((source) => {
        if (BpmnUtils.isSubProcess(source)) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return (source as BpmnSubProcess).children.find((e) =>
            BpmnUtils.isEndEvent(e)
          )!;
        } else {
          return source;
        }
      });
  }

  private getTargets(element: BpmnFlowNode): BpmnFlowNode[] {
    let node: BpmnFlowNode;
    let outgoingFlows: BpmnSequenceFlow[];
    for (
      node = element, outgoingFlows = node.outgoing;
      outgoingFlows.length === 0;
      node = node.parent, outgoingFlows = node.outgoing
    ) {
      if (BpmnUtils.isProcess(node.parent)) {
        return [];
      }
    }
    return outgoingFlows
      .map((flow) => flow.target)
      .map((target) => {
        if (BpmnUtils.isSubProcess(target)) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return (target as BpmnSubProcess).children.find((e) =>
            BpmnUtils.isStartEvent(e)
          )!;
        } else {
          return target;
        }
      });
  }
}
