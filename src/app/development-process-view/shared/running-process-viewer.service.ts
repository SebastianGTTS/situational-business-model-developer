import { Injectable } from '@angular/core';
import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
import runningProcessView from '../bpmn-extensions/running-process-view';
import bmdl from '../../../assets/bpmn_bmdl.json';
import rbmp from '../../../assets/bpmn_running_process.json';
import { BpmnViewerService } from './bpmn-viewer.service';

@Injectable({
  providedIn: 'root'
})
export class RunningProcessViewerService extends BpmnViewerService {

  getBpmnViewer(): BpmnViewer {
    return new BpmnViewer({
      additionalModules: [
        runningProcessView,
      ],
      moddleExtensions: {
        bmdl,
        rbmp,
      }
    });
  }

}
