import { Injectable } from '@angular/core';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { getBBox } from 'diagram-js/lib/util/Elements';
import { BpmnFlowNode } from 'bpmn-js';

@Injectable()
export abstract class BpmnViewerService {
  /**
   * Resize the view to view the diagram correctly
   *
   * @param modeler the modeler that currently displays the process
   */
  resizeView(modeler: BpmnViewer): void {
    const bbox = getBBox(
      modeler
        .get('elementRegistry')
        .filter((element) => !is(element, 'bpmn:Process'))
    );
    const canvas = modeler.get('canvas');
    const view = canvas.viewbox();
    canvas.viewbox({
      x: bbox.x - 160,
      y: bbox.y - 50,
      width: view.outer.width,
      height: view.outer.height,
    });
  }

  /**
   * Focus a specific element
   *
   * @param modeler the modeler that currently displays the process
   * @param id the id of the element
   */
  focusElement(modeler: BpmnViewer, id: string): void {
    const element = modeler.get('elementRegistry').get(id);
    if (element == null) {
      throw new Error('Element does not exist');
    }
    const box = element as BpmnFlowNode;
    modeler.get('selection').select(element);
    const canvas = modeler.get('canvas');
    const viewbox = canvas.viewbox();
    let adjustRatio = false;
    const ratio = viewbox.width / viewbox.height;
    if (viewbox.width < box.width) {
      viewbox.width = box.width + 600;
      adjustRatio = true;
    }
    if (viewbox.height < box.height) {
      viewbox.height = box.height + 600;
      adjustRatio = true;
    }
    if (adjustRatio) {
      if (viewbox.width < viewbox.height * ratio) {
        viewbox.width = viewbox.height * ratio;
      } else if (viewbox.height < 1 / (ratio / viewbox.width)) {
        viewbox.height = 1 / (ratio / viewbox.width);
      }
    }
    viewbox.x = box.x - viewbox.width / 2 + box.width / 2;
    viewbox.y = box.y - viewbox.height / 2 + box.height / 2;
    canvas.viewbox(viewbox);
  }
}
