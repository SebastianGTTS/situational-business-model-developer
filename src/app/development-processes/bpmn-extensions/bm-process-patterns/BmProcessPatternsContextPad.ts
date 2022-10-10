import { is } from 'bpmn-js/lib/util/ModelUtil';
import { BpmnElement, ContextPad, EventBus } from 'bpmn-js';

export default class BmProcessPatternsContextPad {
  static $inject = ['contextPad', 'eventBus'];

  constructor(contextPad: ContextPad, private eventBus: EventBus) {
    contextPad.registerProvider(this);
  }

  getContextPadEntries(element: BpmnElement): {
    [id: string]: {
      group: string;
      className: string;
      title: string;
      action: { click: () => void };
    };
  } {
    if (is(element, 'bpmn:Activity')) {
      return {
        'bmdl.types': {
          group: 'edit',
          className:
            'bpmn-icon-service ' +
            (element.businessObject.get('neededType').length > 0 ||
            element.businessObject.inherit
              ? 'text-success'
              : 'text-danger'),
          title: 'Manage types',
          action: {
            click: (): void =>
              this.eventBus.fire('bmdl.types', element.businessObject),
          },
        },
      };
    } else {
      return {};
    }
  }
}
