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
      const endEvents = node
        .get('flowElements')
        .filter((n: BusinessObject) => is(n, 'bpmn:EndEvent'));
      const visitedNodeIds: Set<string> = new Set<string>();
      const nodes: BusinessObject[] = endEvents;
      for (
        let current: BusinessObject | undefined = nodes.shift();
        current != null;
        current = nodes.shift()
      ) {
        if (visitedNodeIds.has(current.id)) {
          continue;
        }
        visitedNodeIds.add(current.id);
        if (is(current, 'bpmn:StartEvent')) {
          continue;
        }
        const incomingFlows = current.get('incoming');
        if (incomingFlows.length !== 0) {
          nodes.push(
            ...incomingFlows.map((flow: BusinessObject) => flow.sourceRef)
          );
        }
      }
      for (const n of node.get('flowElements')) {
        if (!visitedNodeIds.has(n.get('id')) && is(n, 'bpmn:FlowNode')) {
          reporter.report(n.id, 'From this node no end event can be reached');
        }
      }
    }
  };

  return {
    check: check,
  };
}
