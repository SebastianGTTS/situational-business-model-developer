import {
  AfterContentInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
import { FullRunningProcess } from '../../development-process-registry/running-process/running-process';
import { RunningProcessViewerService } from '../shared/running-process-viewer.service';
import { BpmnFlowNode, BpmnSequenceFlow } from 'bpmn-js';
import * as BpmnUtils from '../../development-process-registry/bpmn/bpmn-utils';
import RunningProcessViewRenderer from '../bpmn-extensions/running-process-view/RunningProcessViewRenderer';

@Component({
  selector: 'app-running-process-viewer',
  templateUrl: './running-process-viewer.component.html',
  styleUrls: ['./running-process-viewer.component.css'],
})
export class RunningProcessViewerComponent
  implements OnInit, OnChanges, AfterContentInit, OnDestroy
{
  @Input() runningProcess?: FullRunningProcess;
  @Input() unreachable?: Set<string>;
  @Input() missingArtifacts?: Set<string>;

  @Output() startExecution = new EventEmitter<string>();
  @Output() fakeExecution = new EventEmitter<string>();
  @Output() skipExecution = new EventEmitter<string>();

  private viewer: BpmnViewer = this.runningProcessViewerService.getBpmnViewer();

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLDivElement>;

  constructor(
    private runningProcessViewerService: RunningProcessViewerService
  ) {}

  ngOnInit(): void {
    const eventBus = this.viewer.get('eventBus');
    eventBus.on('bmp.startExecution', (event, node) =>
      this.startExecution.emit(node.id)
    );
    eventBus.on('bmp.fakeExecution', (event, node) =>
      this.fakeExecution.emit(node.id)
    );
    eventBus.on('bmp.skipExecution', (event, node) =>
      this.skipExecution.emit(node.id)
    );
    if (this.runningProcess != null) {
      this.setUnreachable();
      this.setMissingArtifacts();
      void this.loadBmProcess(this.runningProcess, true);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.viewer != null) {
      if (changes.runningProcess) {
        void this.loadBmProcess(
          changes.runningProcess.currentValue,
          changes.runningProcess.firstChange
        );
      }
      if (changes.unreachable) {
        this.setUnreachable();
      }
      if (changes.missingArtifacts) {
        this.setMissingArtifacts();
      }
      if (changes.missingArtifacts || changes.unreachable) {
        const changedElements = this.viewer
          .get('elementRegistry')
          .filter((element) => BpmnUtils.isFlowNode(element));
        this.viewer
          .get('eventBus')
          .fire('elements.changed', { elements: changedElements });
      }
    }
  }

  ngAfterContentInit(): void {
    this.viewer.attachTo(this.canvas.nativeElement);
  }

  ngOnDestroy(): void {
    this.viewer.destroy();
  }

  focus(id: string): void {
    this.runningProcessViewerService.focusElement(this.viewer, id);
    this.canvas.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  getSelectedFlowNode(): BpmnFlowNode | undefined {
    const selection = this.viewer.get('selection').get()[0];
    if (BpmnUtils.isFlowNode(selection)) {
      return selection as BpmnFlowNode;
    }
    return undefined;
  }

  getSelectedFlow(): BpmnSequenceFlow | undefined {
    const selection = this.viewer.get('selection').get()[0];
    if (BpmnUtils.isSequenceFlow(selection)) {
      return selection as BpmnSequenceFlow;
    }
    return undefined;
  }

  private async loadBmProcess(
    runningProcess: FullRunningProcess,
    firstLoad: boolean
  ): Promise<void> {
    await this.viewer.importXML(runningProcess.process.processDiagram);
    if (firstLoad) {
      this.runningProcessViewerService.resizeView(this.viewer);
    }
  }

  private setUnreachable(): void {
    const runningProcessViewRenderer = this.viewer.get(
      'runningProcessViewRenderer'
    ) as RunningProcessViewRenderer;
    runningProcessViewRenderer.unreachable = this.unreachable;
  }

  private setMissingArtifacts(): void {
    const runningProcessViewRenderer = this.viewer.get(
      'runningProcessViewRenderer'
    ) as RunningProcessViewRenderer;
    runningProcessViewRenderer.missingArtifacts = this.missingArtifacts;
  }
}
