import { is } from 'bpmnlint-utils';
import { BusinessObject } from 'bpmn-js';

/**
 * Checks that all nodes can be reached by the start event
 */
export default function (): {
  check: (node: BusinessObject, reporter: Reporter) => void;
} {
  const check = (node: BusinessObject, reporter: Reporter): void => {
    if (is(node, 'bpmn:Process')) {
      const visitedNodeIds: Set<string> = new Set<string>();
      const nodes: BusinessObject[] = [];
      for (
        let current: BusinessObject | undefined = node
          .get('flowElements')
          .find((n: BusinessObject) => is(n, 'bpmn:StartEvent'));
        current != null;
        current = nodes.shift()
      ) {
        if (visitedNodeIds.has(current.id)) {
          continue;
        }
        visitedNodeIds.add(current.id);
        if (is(current, 'bpmn:EndEvent')) {
          continue;
        }
        const outgoingFlows = current.get('outgoing');
        if (outgoingFlows.length !== 0) {
          nodes.push(
            ...outgoingFlows.map((flow: BusinessObject) => flow.targetRef)
          );
        }
      }
      for (const n of node.get('flowElements')) {
        if (!visitedNodeIds.has(n.get('id')) && is(n, 'bpmn:FlowNode')) {
          reporter.report(n.id, 'This node is unreachable');
        }
      }
    }
  };

  return {
    check: check,
  };
}
