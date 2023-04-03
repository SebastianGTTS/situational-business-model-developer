import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { WhiteboardCanvas } from '../../whiteboard-meta-artifact/whiteboard';
import { fabric } from 'fabric';
import { Subject } from 'rxjs';
import { WhiteboardCanvasService } from '../../whiteboard-meta-artifact/whiteboard-canvas.service';
import { debounceTime, tap } from 'rxjs/operators';

@Directive()
export abstract class WhiteboardCanvasViewBaseComponent
  implements AfterViewInit, OnDestroy
{
  @Input() fullscreen = false;
  @Input() whiteboardCanvas!: WhiteboardCanvas;

  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasWrapper') canvasWrapper!: ElementRef<HTMLDivElement>;

  protected canvas?: fabric.Canvas;
  private resizeSubject = new Subject<void>();
  private resizeObserver: ResizeObserver = new ResizeObserver(() =>
    this.resize()
  );

  private zoomValue = 1;
  protected lastMousePosition?: fabric.Point;
  protected moving = false;

  protected constructor(
    protected whiteboardCanvasService: WhiteboardCanvasService
  ) {}

  ngAfterViewInit(): void {
    void this.initCanvas();
    this.resizeSubject
      .pipe(
        debounceTime(300),
        tap(() => this.resize())
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.canvas?.dispose();
    this.resizeObserver.disconnect();
    this.resizeSubject.complete();
  }

  protected async initCanvas(readonly = true): Promise<void> {
    if (readonly) {
      this.canvas =
        await this.whiteboardCanvasService.getReadonlyWhiteboardCanvas(
          this.canvasElement.nativeElement,
          this.whiteboardCanvas
        );
    } else {
      this.canvas = await this.whiteboardCanvasService.getWhiteboardCanvas(
        this.canvasElement.nativeElement,
        this.whiteboardCanvas
      );
    }
    this.resize();
    this.resizeObserver.observe(this.canvasWrapper.nativeElement);
    this.canvas.on('mouse:move', (options) => this.mouseMove(options));
    this.canvas.on('mouse:down', (options) => this.mouseDown(options));
    this.canvas.on('mouse:up', (options) => this.mouseUp(options));
  }

  private resize(): void {
    if (this.canvas != null) {
      const newWidth = this.canvasWrapper.nativeElement.clientWidth;
      const newHeight = this.fullscreen
        ? this.canvasWrapper.nativeElement.clientHeight
        : newWidth / 3.5;
      this.canvas.setWidth(newWidth);
      this.canvas.setHeight(newHeight);
      this.canvas.setZoom((newWidth * this.zoomValue) / 1140);
    }
  }

  zoom(number: number): void {
    this.zoomValue += number * 0.1;
    this.resize();
  }

  zoomReset(): void {
    this.zoomValue = 1;
    this.resize();
  }

  protected abstract mouseMove(options: fabric.IEvent<MouseEvent>): void;

  protected abstract mouseDown(options: fabric.IEvent<MouseEvent>): void;

  protected abstract mouseUp(options: fabric.IEvent<MouseEvent>): void;
}
