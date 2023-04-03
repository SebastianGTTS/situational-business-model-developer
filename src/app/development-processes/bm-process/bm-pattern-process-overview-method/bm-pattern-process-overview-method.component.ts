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
import { debounceTime, Subject } from 'rxjs';
import { BmPatternProcessService } from 'src/app/development-process-registry/bm-process/bm-pattern-process.service';
import {
  BmPatternProcess,
  BmProcessDiagram,
} from '../../../development-process-registry/bm-process/bm-pattern-process';
import BmProcessTaskRenderer from '../../bpmn-extensions/bm-process/BmProcessTaskRenderer';
import { BmProcessModelerService } from '../../shared/bm-process-modeler.service';

@Component({
  selector: 'app-bm-pattern-process-overview-method',
  templateUrl: './bm-pattern-process-overview-method.component.html',
  styleUrls: ['./bm-pattern-process-overview-method.component.scss'],
})
export class BmPatternProcessOverviewMethodComponent
  implements OnInit, OnChanges, AfterContentInit, OnDestroy
{
  @Input() bmProcess?: BmPatternProcess;

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLDivElement>;

  private viewer: BpmnViewer = this.bmProcessModelerService.getBpmnViewer();
  private resizeSubject = new Subject<void>();
  private resizeObserver: ResizeObserver = new ResizeObserver(() => {
    if (this.bmProcess != null) {
      this.resizeSubject.next();
    }
  });

  constructor(
    private bmProcessModelerService: BmProcessModelerService,
    private bmPatternProcessService: BmPatternProcessService
  ) {}

  ngOnInit(): void {
    this.resizeObserver.observe(this.canvas.nativeElement);
    this.resizeSubject
      .pipe(debounceTime(300))
      .subscribe(() =>
        this.bmProcessModelerService.fitView(
          this.viewer,
          this.canvas.nativeElement.clientWidth,
          this.canvas.nativeElement.clientHeight
        )
      );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.bmProcess) {
      void this.loadBmProcessDiagram(
        changes.bmProcess.currentValue.processDiagram
      );
    }
  }

  ngAfterContentInit(): void {
    this.viewer.attachTo(this.canvas.nativeElement);
  }

  ngOnDestroy(): void {
    this.viewer.destroy();
    this.resizeObserver.disconnect();
    this.resizeSubject.complete();
  }

  private async loadBmProcessDiagram(diagram: BmProcessDiagram): Promise<void> {
    const taskRenderer = this.viewer.get(
      'taskRenderer'
    ) as BmProcessTaskRenderer;
    taskRenderer.process = this.bmProcess;
    taskRenderer.bmProcessService = this.bmPatternProcessService;
    await this.viewer.importXML(diagram);
    this.bmProcessModelerService.fitView(
      this.viewer,
      this.canvas.nativeElement.clientWidth,
      this.canvas.nativeElement.clientHeight
    );
  }
}
