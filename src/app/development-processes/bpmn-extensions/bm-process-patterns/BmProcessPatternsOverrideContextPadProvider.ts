import ContextPadProvider from 'bpmn-js/lib/features/context-pad/ContextPadProvider';
import { BpmnElement } from 'bpmn-js';

export default class BmProcessPatternsOverrideContextPadProvider extends ContextPadProvider {
  getContextPadEntries(element: BpmnElement): {
    [id: string]: {
      group: string;
      className: string;
      title: string;
      action: { click: () => void };
    };
  } {
    const actions = super.getContextPadEntries(element);
    delete actions['append.intermediate-event'];
    return actions;
  }
}
