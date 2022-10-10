import { Injectable } from '@angular/core';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import bmProcess from '../bpmn-extensions/bm-process';
import bmdl from '../../../assets/bpmn_bmdl.json';
import { BpmnViewerService } from '../../development-process-view/shared/bpmn-viewer.service';

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
}
