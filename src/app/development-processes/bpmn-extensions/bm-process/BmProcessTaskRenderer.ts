import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import BpmnRenderer from 'bpmn-js/lib/draw/BpmnRenderer';
import TextRenderer from 'bpmn-js/lib/draw/TextRenderer';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { append, attr, remove, select } from 'tiny-svg';
import { BmPatternProcess } from '../../../development-process-registry/bm-process/bm-pattern-process';
import { BmPatternProcessService } from '../../../development-process-registry/bm-process/bm-pattern-process.service';
import { BpmnElement, BpmnFlowNode, EventBus } from 'bpmn-js';

export default class BmProcessTaskRenderer
  extends BaseRenderer
  implements BpmnElements.TaskRenderer
{
  static $inject = ['eventBus', 'bpmnRenderer', 'textRenderer'];

  private static readonly HIGH_PRIORITY = 1500;

  private bpmnRenderer: BpmnRenderer;
  private textRenderer: TextRenderer;

  process?: BmPatternProcess;
  bmProcessService?: BmPatternProcessService;

  constructor(
    eventBus: EventBus,
    bpmnRenderer: BpmnRenderer,
    textRenderer: TextRenderer
  ) {
    super(eventBus, BmProcessTaskRenderer.HIGH_PRIORITY);

    this.bpmnRenderer = bpmnRenderer;
    this.textRenderer = textRenderer;
  }

  canRender(element: BpmnElement): boolean {
    return is(element, 'bpmn:Task') || is(element, 'bpmn:CallActivity');
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
      if (
        this.process != null &&
        this.bmProcessService != null &&
        element.id in this.process.decisions
      ) {
        const decision = this.process.decisions[element.id];
        if (!this.bmProcessService.checkDecisionStepArtifacts(decision)) {
          attr(shape, { stroke: 'orange', rx: 2, ry: 2 });
        } else if (!decision.isComplete()) {
          attr(shape, { stroke: 'gray', rx: 2, ry: 2 });
        } else {
          attr(shape, { stroke: 'green', rx: 0, ry: 0 });
        }
      } else {
        attr(shape, { stroke: 'green', rx: 0, ry: 0 });
      }
    } else {
      attr(shape, { stroke: 'red' });
    }
    return shape;
  }

  getShapePath(shape: unknown): unknown {
    return this.bpmnRenderer.getShapePath(shape);
  }
}
