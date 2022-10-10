import { Injectable } from '@angular/core';
import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
import runningProcessEdit from '../bpmn-extensions/running-process-edit';
import runningProcessView from '../bpmn-extensions/running-process-view';
import bmdl from '../../../assets/bpmn_bmdl.json';
import rbmp from '../../../assets/bpmn_running_process.json';
import { RunningProcessViewerService } from './running-process-viewer.service';

@Injectable({
  providedIn: 'root',
})
export class RunningProcessViewerEditService extends RunningProcessViewerService {
  getBpmnViewer(): BpmnViewer {
    return new BpmnViewer({
      additionalModules: [runningProcessView, runningProcessEdit],
      moddleExtensions: {
        bmdl,
        rbmp,
      },
    });
  }
}
