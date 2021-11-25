import { is } from 'bpmn-js/lib/util/ModelUtil';

export default class BmProcessContextPadProvider {
  static $inject = ['contextPad', 'eventBus'];

  constructor(contextPad, private eventBus) {
    contextPad.registerProvider(this);
  }

  getContextPadEntries(element) {
    const controls = {};
    if (
      (is(element, 'bpmn:SubProcess') &&
        is(element.parent, 'bpmn:SubProcess')) ||
      is(element, 'bpmn:Task') ||
      is(element, 'bpmn:CallActivity')
    ) {
      controls['bmp.showTypes'] = {
        group: 'info',
        className: 'fas fa-list font-bpmn-adaption',
        title: 'Show types',
        action: {
          click: () => this.eventBus.fire('bmp.showTypes', element),
        },
      };
    }
    if (is(element, 'bpmn:SubProcess')) {
      controls['bmp.showPattern'] = {
        group: 'info',
        className: 'fas fa-info-circle font-bpmn-adaption',
        title: 'Show Method Pattern details',
        action: {
          click: () => this.eventBus.fire('bmp.showPattern', element),
        },
      };
      controls['bmp.deletePattern'] = {
        group: 'edit',
        className: 'far fa-trash-alt font-bpmn-adaption',
        title: 'Delete Method Pattern',
        action: {
          click: () => this.eventBus.fire('bmp.deletePattern', element),
        },
      };
    }
    if (
      (is(element, 'bpmn:StartEvent') || is(element, 'bpmn:SubProcess')) &&
      element.businessObject.get('outgoing').length === 0
    ) {
      controls['bmp.processPatterns'] = {
        group: 'edit',
        className: 'far fa-plus-square font-bpmn-adaption',
        title: 'Add Method Pattern',
        action: {
          click: () => this.eventBus.fire('bmp.processPatterns', element),
        },
      };
    }
    if (is(element, 'bpmn:Task') || is(element, 'bpmn:CallActivity')) {
      controls['bmp.selectMethod'] = {
        group: 'edit',
        className: 'fas fa-database font-bpmn-adaption',
        title: 'Select Method Building Block',
        action: {
          click: () => this.eventBus.fire('bmp.selectMethod', element),
        },
      };
      if (element.businessObject.method) {
        controls['bmp.showMethod'] = {
          group: 'edit',
          className: 'fas fa-clipboard-list font-bpmn-adaption',
          title: 'Edit Method Building Block details',
          action: {
            click: () => this.eventBus.fire('bmp.showMethod', element),
          },
        };
        controls['bmp.summary'] = {
          group: 'info',
          className: 'fas fa-clipboard-check font-bpmn-adaption',
          title: 'Show Method Building Block summary',
          action: {
            click: () => this.eventBus.fire('bmp.summary', element),
          },
        };
        controls['bmp.removeMethod'] = {
          group: 'edit',
          className: 'far fa-trash-alt font-bpmn-adaption',
          title: 'Remove Method Building Block from task',
          action: {
            click: () => this.eventBus.fire('bmp.removeMethod', element),
          },
        };
      }
    }
    if (is(element, 'bpmn:CallActivity')) {
      controls['bmp.selectPattern'] = {
        group: 'edit',
        className: 'fas fa-sign-in-alt font-bpmn-adaption',
        title: 'Insert Method Pattern',
        action: {
          click: () => this.eventBus.fire('bmp.selectPattern', element),
        },
      };
    }
    return controls;
  }
}
