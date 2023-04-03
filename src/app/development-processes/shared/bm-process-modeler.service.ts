import { Injectable } from '@angular/core';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import BpmnViewer from 'bpmn-js/lib/Viewer';
import bmdl from '../../../assets/bpmn_bmdl.json';
import { BpmnViewerService } from '../../development-process-view/shared/bpmn-viewer.service';
import bmProcess, { viewOnly } from '../bpmn-extensions/bm-process';

@Injectable({
  providedIn: 'root',
})
export class BmProcessModelerService extends BpmnViewerService {
  /**
   * Get a BpmnModeler with customizations to support the development of business model development processes
   *
   * @returns a bpmnModeler
   */
  getBpmnModeler(): BpmnModeler {
    return new BpmnModeler({
      additionalModules: [bmProcess],
      moddleExtensions: {
        bmdl,
      },
    });
  }

  /**
   * Get a read only BpmnViewer to view business model development processes
   */
  getBpmnViewer(): BpmnViewer {
    return new BpmnViewer({
      additionalModules: [
        viewOnly,
        {
          selection: ['value', {}],
          selectionVisuals: ['value', {}],
          selectionBehavior: ['value', {}],
        },
      ],
      moddleExtensions: {
        bmdl,
      },
    });
  }
}
