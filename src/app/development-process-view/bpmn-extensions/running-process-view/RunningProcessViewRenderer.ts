import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import BpmnRenderer from 'bpmn-js/lib/draw/BpmnRenderer';
import TextRenderer from 'bpmn-js/lib/draw/TextRenderer';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { append, attr, remove, select } from 'tiny-svg';

export default class RunningProcessViewRenderer extends BaseRenderer {
  static $inject = ['eventBus', 'bpmnRenderer', 'textRenderer'];

  private static readonly HIGH_PRIORITY = 1500;

  private bpmnRenderer: BpmnRenderer;
  private textRenderer: TextRenderer;

  constructor(eventBus, bpmnRenderer, textRenderer) {
    super(eventBus, RunningProcessViewRenderer.HIGH_PRIORITY);

    this.bpmnRenderer = bpmnRenderer;
    this.textRenderer = textRenderer;
  }

  canRender(element) {
    return is(element, 'bpmn:FlowNode') || is(element, 'bpmn:SequenceFlow');
  }

  drawShape(parentNode: SVGGElement, element) {
    const shape: SVGRectElement = this.bpmnRenderer.drawShape(
      parentNode,
      element
    );
    const method = element.businessObject.get('method');
    if (method) {
      remove(select(parentNode, 'text'));
      const methodName = this.textRenderer.createText(method.name, {
        box: element,
        align: 'center-middle',
        padding: 5,
      });
      append(parentNode, methodName);
      attr(shape, { rx: 0, ry: 0 });
    }
    if (element.businessObject.get('tokens') > 0) {
      attr(shape, { stroke: 'red' });
    } else if (element.businessObject.get('executed')) {
      attr(shape, { stroke: 'green' });
    }
    return shape;
  }

  drawConnection(parentNode: SVGGElement, element) {
    const connection: SVGPathElement = this.bpmnRenderer.drawConnection(
      parentNode,
      element
    );
    if (element.businessObject.get('used')) {
      attr(connection, { stroke: 'green' });
    }
    return connection;
  }

  getShapePath(shape) {
    return this.bpmnRenderer.getShapePath(shape);
  }
}
