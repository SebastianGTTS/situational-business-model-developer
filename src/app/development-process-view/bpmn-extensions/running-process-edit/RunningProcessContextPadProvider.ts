import { is } from 'bpmn-js/lib/util/ModelUtil';
import { BpmnFlowNode, ContextPad, EventBus } from 'bpmn-js';

export default class BmProcessContextPadProvider {
  static $inject = ['contextPad', 'eventBus'];

  constructor(contextPad: ContextPad, private eventBus: EventBus) {
    contextPad.registerProvider(this);
  }

  getContextPadEntries(element: BpmnFlowNode): {
    [id: string]: {
      group: string;
      className: string;
      title: string;
      action: { click: () => void };
    };
  } {
    const controls: {
      [id: string]: {
        group: string;
        className: string;
        title: string;
        action: { click: () => void };
      };
    } = {};
    if (is(element, 'bpmn:FlowNode') && !is(element, 'bpmn:SubProcess')) {
      controls['bmp.startExecution'] = {
        group: 'edit',
        className: 'bi bi-play-circle font-bpmn-adaption',
        title: 'Start execution here',
        action: {
          click: (): void => this.eventBus.fire('bmp.startExecution', element),
        },
      };
    }
    if (
      (is(element, 'bpmn:Task') || is(element, 'bpmn:CallActivity')) &&
      element.businessObject.method != null
    ) {
      controls['bmp.fakeExecution'] = {
        group: 'edit',
        className: 'bi bi-plus-circle font-bpmn-adaption',
        title: 'Fake execution of development step',
        action: {
          click: (): void => this.eventBus.fire('bmp.fakeExecution', element),
        },
      };
      if (element.businessObject.get('tokens') > 0) {
        controls['bmp.skipExecution'] = {
          group: 'edit',
          className: 'bi bi-arrow-right-circle font-bpmn-adaption',
          title: 'Skip execution of development step',
          action: {
            click: (): void => this.eventBus.fire('bmp.skipExecution', element),
          },
        };
      }
    }
    return controls;
  }
}
