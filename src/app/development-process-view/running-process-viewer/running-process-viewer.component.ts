import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
import { RunningProcess } from '../../development-process-registry/running-process/running-process';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { RunningProcessViewerService } from '../shared/running-process-viewer.service';

@Component({
  selector: 'app-running-process-viewer',
  templateUrl: './running-process-viewer.component.html',
  styleUrls: ['./running-process-viewer.component.css'],
})
export class RunningProcessViewerComponent
  implements OnInit, OnChanges, AfterContentInit, OnDestroy
{
  @Input() runningProcess: RunningProcess;

  private viewer: BpmnViewer;

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLDivElement>;

  constructor(
    private runningProcessViewerService: RunningProcessViewerService
  ) {}

  ngOnInit() {
    this.viewer = this.runningProcessViewerService.getBpmnViewer();
    if (this.runningProcess) {
      this.loadBmProcess(this.runningProcess, true);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.runningProcess && this.viewer) {
      this.loadBmProcess(
        changes.runningProcess.currentValue,
        changes.runningProcess.firstChange
      );
    }
  }

  ngAfterContentInit() {
    this.viewer.attachTo(this.canvas.nativeElement);
  }

  ngOnDestroy() {
    this.viewer.destroy();
  }

  focus(id: string) {
    this.runningProcessViewerService.focusElement(this.viewer, id);
    this.canvas.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  getSelectedFlowNode() {
    const selection = this.viewer.get('selection').get()[0];
    if (is(selection, 'bpmn:FlowNode')) {
      return selection;
    }
    return null;
  }

  getSelectedFlow() {
    const selection = this.viewer.get('selection').get()[0];
    if (is(selection, 'bpmn:SequenceFlow')) {
      return selection;
    }
    return null;
  }

  private loadBmProcess(runningProcess: RunningProcess, firstLoad: boolean) {
    this.viewer
      .importXML(runningProcess.process.processDiagram)
      .then(() => {
        if (firstLoad) {
          this.runningProcessViewerService.resizeView(this.viewer);
        }
      })
      .catch((error) => console.log('LoadBmProcess: ' + error));
  }
}
