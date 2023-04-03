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
import { ProcessPatternModelerService } from '../../shared/process-pattern-modeler.service';
import { PatternDiagram } from '../../../development-process-registry/process-pattern/process-pattern';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-process-pattern-overview-pattern',
  templateUrl: './process-pattern-overview-pattern.component.html',
  styleUrls: ['./process-pattern-overview-pattern.component.scss'],
})
export class ProcessPatternOverviewPatternComponent
  implements OnInit, OnChanges, AfterContentInit, OnDestroy
{
  @Input() pattern?: PatternDiagram;

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLDivElement>;

  private viewer: BpmnViewer =
    this.processPatternModelerService.getBpmnViewer();
  private resizeSubject = new Subject<void>();
  private resizeObserver: ResizeObserver = new ResizeObserver(() => {
    if (this.pattern != null) {
      this.resizeSubject.next();
    }
  });

  constructor(
    private processPatternModelerService: ProcessPatternModelerService
  ) {}

  ngOnInit(): void {
    this.resizeObserver.observe(this.canvas.nativeElement);
    this.resizeSubject
      .pipe(debounceTime(300))
      .subscribe(() =>
        this.processPatternModelerService.fitView(
          this.viewer,
          this.canvas.nativeElement.clientWidth,
          this.canvas.nativeElement.clientHeight
        )
      );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pattern) {
      void this.loadProcessPattern(changes.pattern.currentValue);
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

  private async loadProcessPattern(
    patternDiagram: PatternDiagram
  ): Promise<void> {
    await this.viewer.importXML(patternDiagram);
    this.processPatternModelerService.fitView(
      this.viewer,
      this.canvas.nativeElement.clientWidth,
      this.canvas.nativeElement.clientHeight
    );
  }
}
