import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { fabric } from 'fabric';
import { WhiteboardCanvas } from '../../whiteboard-meta-model/whiteboard';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { WhiteboardCanvasService } from '../../whiteboard-meta-model/whiteboard-canvas.service';

@Component({
  selector: 'app-whiteboard-canvas-view',
  templateUrl: './whiteboard-canvas-view.component.html',
  styleUrls: ['./whiteboard-canvas-view.component.css'],
})
export class WhiteboardCanvasViewComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  @Input() whiteboardCanvas!: WhiteboardCanvas;

  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasWrapper') canvasWrapper!: ElementRef<HTMLDivElement>;

  private canvas!: fabric.Canvas;

  private resizeSubscription?: Subscription;

  private zoomValue = 1;
  private lastMousePosition?: fabric.Point;
  private moving = false;

  constructor(private whiteboardCanvasService: WhiteboardCanvasService) {}

  ngAfterViewInit(): void {
    void this.initCanvas();
    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(
        debounceTime(300),
        tap(() => this.resize())
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.whiteboardCanvas && this.canvas != null) {
      void this.whiteboardCanvasService.reload(
        this.canvas,
        changes.whiteboardCanvas.currentValue
      );
    }
  }

  ngOnDestroy(): void {
    this.resizeSubscription?.unsubscribe();
    this.canvas?.dispose();
  }

  private async initCanvas(): Promise<void> {
    this.canvas =
      await this.whiteboardCanvasService.getReadonlyWhiteboardCanvas(
        this.canvasElement.nativeElement,
        this.whiteboardCanvas
      );
    this.resize();
    this.canvas.on('mouse:move', (options) => this.mouseMove(options));
    this.canvas.on('mouse:down', (options) => this.mouseDown(options));
    this.canvas.on('mouse:up', () => this.mouseUp());
  }

  private resize(): void {
    const newWidth = this.canvasWrapper.nativeElement.clientWidth;
    this.canvas.setWidth(newWidth);
    this.canvas.setHeight(newWidth / 3.5);
    this.canvas.setZoom((newWidth * this.zoomValue) / 1140);
  }

  zoom(number: number): void {
    this.zoomValue += number * 0.1;
    this.resize();
  }

  zoomReset(): void {
    this.zoomValue = 1;
    this.resize();
  }

  private mouseMove(options: fabric.IEvent<MouseEvent>): void {
    if (options.absolutePointer == null) {
      return;
    }
    if (this.moving && this.lastMousePosition != null) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const viewport = this.canvas.viewportTransform!;
      viewport[4] += options.absolutePointer.x - this.lastMousePosition.x;
      viewport[5] += options.absolutePointer.y - this.lastMousePosition.y;
      this.canvas.setViewportTransform(viewport);
    }
  }

  private mouseDown(options: fabric.IEvent<MouseEvent>): void {
    if (options.absolutePointer != null) {
      this.lastMousePosition = options.absolutePointer;
      this.moving = true;
    }
  }

  private mouseUp(): void {
    this.moving = false;
  }
}
