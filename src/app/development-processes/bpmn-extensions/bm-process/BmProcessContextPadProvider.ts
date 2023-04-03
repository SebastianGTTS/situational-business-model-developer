import { is } from 'bpmn-js/lib/util/ModelUtil';
import { BpmnFlowNode, ContextPad, EventBus } from 'bpmn-js';

export default class BmProcessContextPadProvider {
  static $inject = ['contextPad', 'eventBus'];

  constructor(contextPad: ContextPad, private eventBus: EventBus) {
    contextPad.registerProvider(this);
  }

  getContextPadEntries(element: BpmnFlowNode): {
    [id: string]: {
      html?: string;
      group: string;
      className: string;
      title: string;
      action: { click: () => void };
    };
  } {
    const controls: {
      [id: string]: {
        html?: string;
        group: string;
        className: string;
        title: string;
        action: { click: () => void };
      };
    } = {};
    if (
      (is(element, 'bpmn:SubProcess') &&
        is(element.parent, 'bpmn:SubProcess')) ||
      is(element, 'bpmn:Task') ||
      is(element, 'bpmn:CallActivity')
    ) {
      controls['bmp.showTypes'] = {
        group: 'info',
        className: 'bi bi-list-ul font-bpmn-adaption',
        title: 'Show types',
        action: {
          click: (): void => this.eventBus.fire('bmp.showTypes', element),
        },
      };
    }
    if (is(element, 'bpmn:SubProcess')) {
      controls['bmp.showPattern'] = {
        group: 'info',
        className: 'bi bi-info-square font-bpmn-adaption',
        title: 'Show Method Pattern details',
        action: {
          click: (): void => this.eventBus.fire('bmp.showPattern', element),
        },
      };
      controls['bmp.deletePattern'] = {
        group: 'edit',
        className: 'bi bi-trash font-bpmn-adaption',
        title: 'Delete Method Pattern',
        action: {
          click: (): void => this.eventBus.fire('bmp.deletePattern', element),
        },
      };
    }
    if (
      (is(element, 'bpmn:StartEvent') || is(element, 'bpmn:SubProcess')) &&
      element.businessObject.get('outgoing').length === 0
    ) {
      controls['bmp.processPatterns'] = {
        html: '<div id="bm-process-context-pad-add-method-pattern" class="entry" draggable="true"></div>',
        group: 'edit',
        className: 'bi bi-plus-square font-bpmn-adaption',
        title: 'Add Method Pattern',
        action: {
          click: (): void => this.eventBus.fire('bmp.processPatterns', element),
        },
      };
    }
    if (is(element, 'bpmn:Task') || is(element, 'bpmn:CallActivity')) {
      controls['bmp.selectMethod'] = {
        group: 'edit',
        className: 'bi bi-server font-bpmn-adaption',
        title: 'Select Method Building Block',
        action: {
          click: (): void => this.eventBus.fire('bmp.selectMethod', element),
        },
      };
      if (element.businessObject.method) {
        controls['bmp.showMethod'] = {
          group: 'edit',
          className: 'bi bi-gear font-bpmn-adaption',
          title: 'Edit Method Building Block details',
          action: {
            click: (): void => this.eventBus.fire('bmp.showMethod', element),
          },
        };
        controls['bmp.summary'] = {
          group: 'info',
          className: 'bi bi-clipboard-check font-bpmn-adaption',
          title: 'Show Method Building Block summary',
          action: {
            click: (): void => this.eventBus.fire('bmp.summary', element),
          },
        };
        controls['bmp.removeMethod'] = {
          group: 'edit',
          className: 'bi bi-trash font-bpmn-adaption',
          title: 'Remove Method Building Block from task',
          action: {
            click: (): void => this.eventBus.fire('bmp.removeMethod', element),
          },
        };
      }
    }
    if (is(element, 'bpmn:CallActivity')) {
      controls['bmp.selectPattern'] = {
        group: 'edit',
        className: 'bi bi-box-arrow-in-right font-bpmn-adaption',
        title: 'Insert Method Pattern',
        action: {
          click: (): void => this.eventBus.fire('bmp.selectPattern', element),
        },
      };
    }
    return controls;
  }
}
