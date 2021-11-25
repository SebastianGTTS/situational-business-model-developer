import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import BpmnRenderer from 'bpmn-js/lib/draw/BpmnRenderer';
import TextRenderer from 'bpmn-js/lib/draw/TextRenderer';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { append, attr, remove, select } from 'tiny-svg';
import { BmProcess } from '../../../development-process-registry/bm-process/bm-process';
import { BmProcessService } from '../../../development-process-registry/bm-process/bm-process.service';

export default class BmProcessTaskRenderer extends BaseRenderer {
  static $inject = ['eventBus', 'bpmnRenderer', 'textRenderer'];

  private static readonly HIGH_PRIORITY = 1500;

  private bpmnRenderer: BpmnRenderer;
  private textRenderer: TextRenderer;

  private process: BmProcess = null;
  private bmProcessService: BmProcessService;

  constructor(eventBus, bpmnRenderer, textRenderer) {
    super(eventBus, BmProcessTaskRenderer.HIGH_PRIORITY);

    this.bpmnRenderer = bpmnRenderer;
    this.textRenderer = textRenderer;
  }

  canRender(element) {
    return is(element, 'bpmn:Task') || is(element, 'bpmn:CallActivity');
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
      if (this.process && element.id in this.process.decisions) {
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

  getShapePath(shape) {
    return this.bpmnRenderer.getShapePath(shape);
  }
}
