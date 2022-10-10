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
import {
  BmProcess,
  BmProcessDiagram,
} from '../../development-process-registry/bm-process/bm-process';
import { BmProcessModelerService } from '../shared/bm-process-modeler.service';
import { BpmnFlowNode, BpmnSubProcess } from 'bpmn-js';
import BmProcessTaskRenderer from '../bpmn-extensions/bm-process/BmProcessTaskRenderer';
import { BmProcessService } from '../../development-process-registry/bm-process/bm-process.service';

@Component({
  selector: 'app-bm-process-modeler',
  templateUrl: './bm-process-modeler.component.html',
  styleUrls: ['./bm-process-modeler.component.css'],
})
export class BmProcessModelerComponent
  implements OnInit, OnChanges, AfterContentInit, OnDestroy
{
  @Input() bmProcess!: BmProcess;

  @Output() addProcessPattern = new EventEmitter<BpmnFlowNode>();
  @Output() insertProcessPattern = new EventEmitter<BpmnFlowNode>();
  @Output() deleteProcessPattern = new EventEmitter<BpmnSubProcess>();
  @Output() insertDevelopmentMethod = new EventEmitter<BpmnFlowNode>();
  @Output() removeDevelopmentMethod = new EventEmitter<BpmnFlowNode>();
  @Output() showTypes = new EventEmitter<BpmnFlowNode>();
  @Output() showMethodInfo = new EventEmitter<BpmnFlowNode>();
  @Output() showMethodSummary = new EventEmitter<BpmnFlowNode>();
  @Output() showProcessPatternInfo = new EventEmitter<BpmnSubProcess>();

  private modeler: BpmnModeler = this.bmProcessViewerService.getBpmnModeler();

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLDivElement>;

  constructor(
    private bmProcessService: BmProcessService,
    private bmProcessViewerService: BmProcessModelerService
  ) {}

  ngOnInit(): void {
    const eventBus = this.modeler.get('eventBus');
    eventBus.on('bmp.deletePattern', (event, subProcessElement) =>
      this.deleteProcessPattern.emit(subProcessElement)
    );
    eventBus.on('bmp.processPatterns', (event, node) =>
      this.addProcessPattern.emit(node)
    );
    eventBus.on('bmp.removeMethod', (event, node) =>
      this.removeDevelopmentMethod.emit(node)
    );
    eventBus.on('bmp.selectMethod', (event, node) =>
      this.insertDevelopmentMethod.emit(node)
    );
    eventBus.on('bmp.selectPattern', (event, node) =>
      this.insertProcessPattern.emit(node)
    );
    eventBus.on('bmp.showTypes', (event, node) => this.showTypes.emit(node));
    eventBus.on('bmp.showMethod', (event, node) =>
      this.showMethodInfo.emit(node)
    );
    eventBus.on('bmp.showPattern', (event, node) =>
      this.showProcessPatternInfo.emit(node)
    );
    eventBus.on('bmp.summary', (event, node) =>
      this.showMethodSummary.emit(node)
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.bmProcess) {
      void this.loadBmProcess(
        changes.bmProcess.currentValue,
        changes.bmProcess.firstChange
      );
    }
  }

  ngAfterContentInit(): void {
    this.modeler.attachTo(this.canvas.nativeElement);
  }

  ngOnDestroy(): void {
    this.modeler.destroy();
  }

  focus(id: string): void {
    this.bmProcessViewerService.focusElement(this.modeler, id);
    this.canvas.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  private async loadBmProcess(
    bmProcess: BmProcess,
    firstLoad: boolean
  ): Promise<void> {
    const taskRenderer = this.modeler.get(
      'taskRenderer'
    ) as BmProcessTaskRenderer;
    taskRenderer.process = bmProcess;
    taskRenderer.bmProcessService = this.bmProcessService;
    await this.modeler.importXML(bmProcess.processDiagram);
    if (firstLoad) {
      this.bmProcessViewerService.resizeView(this.modeler);
    }
  }

  async getDiagramXml(): Promise<BmProcessDiagram> {
    const saveResult = await this.modeler.saveXML();
    return saveResult.xml;
  }

  async diagramChanged(): Promise<boolean> {
    const saveResult = await this.modeler.saveXML();
    return saveResult.xml !== this.bmProcess.processDiagram;
  }
}
