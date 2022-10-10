import { is } from 'bpmnlint-utils';
import { BusinessObject } from 'bpmn-js';

export default function (): {
  check: (node: BusinessObject, reporter: Reporter) => void;
} {
  const check = (node: BusinessObject, reporter: Reporter): void => {
    if (is(node, 'bpmn:Activity')) {
      if (node.get('neededType').length === 0 && !node.inherit) {
        reporter.report(
          node.id,
          'Must set types or inherit types via gear icon'
        );
      }
    }
  };

  return {
    check: check,
  };
}
