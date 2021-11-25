import { is } from 'bpmn-js/lib/util/ModelUtil';

export default class BmProcessPatternsContextPad {
  static $inject = ['contextPad', 'eventBus'];

  constructor(contextPad, private eventBus) {
    contextPad.registerProvider(this);
  }

  getContextPadEntries(element) {
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
            click: () =>
              this.eventBus.fire('bmdl.types', element.businessObject),
          },
        },
      };
    } else {
      return {};
    }
  }
}
