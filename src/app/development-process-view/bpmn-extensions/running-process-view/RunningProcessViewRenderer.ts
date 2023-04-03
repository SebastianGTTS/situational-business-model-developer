import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import BpmnRenderer from 'bpmn-js/lib/draw/BpmnRenderer';
import TextRenderer from 'bpmn-js/lib/draw/TextRenderer';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { append, attr, remove, select } from 'tiny-svg';
import {
  BpmnElement,
  BpmnFlowNode,
  BpmnSequenceFlow,
  EventBus,
  TaskRenderer,
} from 'bpmn-js';

export default class RunningProcessViewRenderer
  extends BaseRenderer
  implements TaskRenderer
{
  static $inject = ['eventBus', 'bpmnRenderer', 'textRenderer'];

  private static readonly HIGH_PRIORITY = 1500;

  private bpmnRenderer: BpmnRenderer;
  private textRenderer: TextRenderer;

  unreachable?: Set<string>;
  missingArtifacts?: Set<string>;

  constructor(
    eventBus: EventBus,
    bpmnRenderer: BpmnRenderer,
    textRenderer: TextRenderer
  ) {
    super(eventBus, RunningProcessViewRenderer.HIGH_PRIORITY);

    this.bpmnRenderer = bpmnRenderer;
    this.textRenderer = textRenderer;
  }

  canRender(element: BpmnElement): boolean {
    return is(element, 'bpmn:FlowNode') || is(element, 'bpmn:SequenceFlow');
  }

  drawShape(parentNode: SVGGElement, element: BpmnFlowNode): SVGRectElement {
    const shape: SVGRectElement = this.bpmnRenderer.drawShape(
      parentNode,
      element
    ) as SVGRectElement;
    const method = element.businessObject.get('method');
    if (method) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      remove(select(parentNode, 'text')!);
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
    } else if (this.unreachable != null && this.unreachable.has(element.id)) {
      attr(shape, { stroke: 'orange', rx: 2, ry: 2 });
    } else if (
      this.missingArtifacts != null &&
      this.missingArtifacts.has(element.id)
    ) {
      attr(shape, { stroke: 'gray', rx: 2, ry: 2 });
    } else if (element.businessObject.get('executed')) {
      attr(shape, { stroke: 'green' });
    }
    return shape;
  }

  drawConnection(
    parentNode: SVGGElement,
    element: BpmnSequenceFlow
  ): SVGPathElement {
    const connection: SVGPathElement = this.bpmnRenderer.drawConnection(
      parentNode,
      element
    );
    if (element.businessObject.get('used')) {
      attr(connection, { stroke: 'green' });
    }
    return connection;
  }

  getShapePath(shape: unknown): unknown {
    return this.bpmnRenderer.getShapePath(shape);
  }
}
