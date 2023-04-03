import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import BpmnRenderer from 'bpmn-js/lib/draw/BpmnRenderer';
import { BpmnElement, BpmnFlowNode, EventBus } from 'bpmn-js';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { attr } from 'tiny-svg';
import { isProcess } from '../../../development-process-registry/bpmn/bpmn-utils';

export default class BmProcessStartEventRenderer extends BaseRenderer {
  static $inject = ['eventBus', 'bpmnRenderer'];

  private static readonly HIGH_PRIORITY = 1500;

  constructor(eventBus: EventBus, private bpmnRenderer: BpmnRenderer) {
    super(eventBus, BmProcessStartEventRenderer.HIGH_PRIORITY);
  }

  canRender(element: BpmnElement): boolean {
    return is(element, 'bpmn:StartEvent');
  }

  drawShape(parentNode: SVGGElement, element: BpmnFlowNode): SVGCircleElement {
    const startEventShape: SVGCircleElement = this.bpmnRenderer.drawShape(
      parentNode,
      element
    ) as SVGCircleElement;
    if (isProcess(element.parent)) {
      attr(parentNode.parentNode as SVGGElement, {
        id: 'bm-process-start-event',
        'data-outgoing': element.businessObject.get('outgoing').length,
      });
    }
    return startEventShape;
  }
}
