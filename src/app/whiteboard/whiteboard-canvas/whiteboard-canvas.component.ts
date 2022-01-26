import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { fabric } from 'fabric';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { WhiteboardCanvas } from '../../whiteboard-meta-model/whiteboard';
import { WhiteboardCanvasControls } from './whiteboard-canvas-controls';
import { CanvasNote } from '../../whiteboard-meta-model/canvas-note';
import { WhiteboardCanvasService } from '../../whiteboard-meta-model/whiteboard-canvas.service';
import { ColorDefinition, colors, noColor } from './color-definition';
import { TextFormService } from './text-form.service';
import { ColorControls, ColorFormService } from './color-form.service';
import { ControlFormService, Controls } from './control-form.service';
import { PropertiesFormService } from './properties-form.service';

@Component({
  selector: 'app-whiteboard-canvas',
  templateUrl: './whiteboard-canvas.component.html',
  styleUrls: ['./whiteboard-canvas.component.css'],
  providers: [
    ColorFormService,
    ControlFormService,
    PropertiesFormService,
    TextFormService,
  ],
})
export class WhiteboardCanvasComponent
  implements WhiteboardCanvasControls, AfterViewInit, OnDestroy
{
  @Input() whiteboardCanvas!: WhiteboardCanvas;

  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasWrapper') canvasWrapper!: ElementRef<HTMLDivElement>;

  private canvas!: fabric.Canvas;

  private resizeSubscription?: Subscription;
  private controlChangeSubscription?: Subscription;

  private zoomValue: number = 1;
  private lastMousePosition?: fabric.Point;
  private moving: boolean = false;
  private adding: boolean = false;

  constructor(
    private colorFormService: ColorFormService,
    private controlFormService: ControlFormService,
    private propertiesFormService: PropertiesFormService,
    private textFormService: TextFormService,
    private whiteboardCanvasService: WhiteboardCanvasService
  ) {}

  ngAfterViewInit(): void {
    void this.initCanvas();
    this.controlChangeSubscription =
      this.controlFormService.controlControl.valueChanges
        .pipe(tap((value) => this.controlChange(value)))
        .subscribe();
    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(
        debounceTime(300),
        tap(() => this.resize())
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    if (this.resizeSubscription != null) {
      this.resizeSubscription.unsubscribe();
    }
    if (this.canvas != null) {
      this.canvas.dispose();
    }
  }

  private async initCanvas(): Promise<void> {
    this.canvas = await this.whiteboardCanvasService.getWhiteboardCanvas(
      this.canvasElement.nativeElement,
      this.whiteboardCanvas
    );
    this.canvas.freeDrawingBrush.color = colors[0].value!;
    this.canvas.freeDrawingBrush.width =
      this.propertiesFormService.widthControlValue;
    this.resize();
    this.colorFormService.init(this.canvas);
    this.textFormService.init(this.canvas);
    this.propertiesFormService.init(this.canvas);
    this.canvas.on('mouse:move', (options) => this.mouseMove(options));
    this.canvas.on('mouse:down', (options) => this.mouseDown(options));
    this.canvas.on('mouse:up', (options) => this.mouseUp(options));
    this.canvas.on('selection:created', () => this.updateForms());
    this.canvas.on('selection:updated', () => this.updateForms());
    this.canvas.on('selection:cleared', () => this.updateForms());
    this.canvas.on('text:selection:changed', () => this.updateForms());
  }

  private resize(): void {
    const newWidth = this.canvasWrapper.nativeElement.clientWidth;
    this.canvas.setWidth(newWidth);
    this.canvas.setHeight(newWidth / 3.5);
    this.canvas.setZoom((newWidth * this.zoomValue) / 1140);
  }

  /**
   * Update the different forms if the selection changes
   */
  private updateForms(): void {
    this.colorFormService.updateColorForm();
    this.textFormService.updateTextForm();
    this.propertiesFormService.updatePropertiesForm();
  }

  private controlChange(controlValue: Controls): void {
    this.canvas.selection = true;
    this.canvas.isDrawingMode = false;
    switch (controlValue) {
      case Controls.VIEW:
        this.canvas.defaultCursor = 'default';
        break;
      case Controls.MOVE:
        this.canvas.defaultCursor = 'move';
        this.canvas.selection = false;
        break;
      case Controls.DRAWING:
        this.canvas.isDrawingMode = true;
        break;
      case Controls.TEXT:
      case Controls.NOTE:
      case Controls.RECT:
        this.canvas.defaultCursor = 'cell';
        break;
    }
    this.colorFormService.updateColorForm();
    this.propertiesFormService.updatePropertiesForm();
  }

  private mouseMove(options: fabric.IEvent<MouseEvent>): void {
    if (options.absolutePointer == null) {
      return;
    }
    if (
      this.moving &&
      this.lastMousePosition != null &&
      this.controlFormService.controlValue === Controls.MOVE
    ) {
      const viewport = this.canvas.viewportTransform!;
      viewport[4] += options.absolutePointer.x - this.lastMousePosition.x;
      viewport[5] += options.absolutePointer.y - this.lastMousePosition.y;
      this.canvas.setViewportTransform(viewport);
    }
  }

  private mouseDown(options: fabric.IEvent<MouseEvent>): void {
    if (options.target != null || options.absolutePointer == null) {
      return;
    }
    switch (this.controlFormService.controlValue) {
      case Controls.TEXT:
        const text = new fabric.Textbox('Text', {
          top: options.absolutePointer.y,
          left: options.absolutePointer.x,
          width: 50,
        });
        this.canvas.add(text);
        this.controlFormService.controlControl.setValue(Controls.VIEW);
        break;
      case Controls.NOTE:
        this.canvas.add(this.createNote(options.absolutePointer));
        this.controlFormService.controlControl.setValue(Controls.VIEW);
        break;
      case Controls.RECT:
        this.lastMousePosition = options.absolutePointer;
        this.adding = true;
        break;
      case Controls.MOVE:
        this.lastMousePosition = options.absolutePointer;
        this.moving = true;
        break;
    }
  }

  private mouseUp(options: fabric.IEvent<MouseEvent>): void {
    if (
      this.adding &&
      options.absolutePointer != null &&
      this.lastMousePosition != null
    ) {
      let position: {
        left: number;
        top: number;
        width: number;
        height: number;
      };
      if (options.absolutePointer.distanceFrom(this.lastMousePosition) < 10) {
        position = {
          left: options.absolutePointer.x - 10,
          top: options.absolutePointer.y - 10,
          width: 20,
          height: 20,
        };
      } else {
        position = {
          left: Math.min(this.lastMousePosition.x, options.absolutePointer.x),
          top: Math.min(this.lastMousePosition.y, options.absolutePointer.y),
          width: Math.abs(this.lastMousePosition.x - options.absolutePointer.x),
          height: Math.abs(
            this.lastMousePosition.y - options.absolutePointer.y
          ),
        };
      }
      switch (this.controlFormService.controlValue) {
        case Controls.RECT:
          const rect = new fabric.Rect({
            ...position,
            fill: colors[1].value,
          });
          this.canvas.add(rect);
          break;
      }
      this.controlFormService.controlControl.setValue(Controls.VIEW);
    }
    this.moving = false;
    this.adding = false;
  }

  @HostListener('window:keydown', ['$event'])
  private keydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Delete':
      case 'Backspace':
        // TODO look for interference with other input fields first
        break;
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

  /**
   * Deletes currently selected object
   */
  delete(): void {
    this.canvas.remove(...this.canvas.getActiveObjects());
    this.canvas.discardActiveObject();
  }

  save(): string {
    return this.whiteboardCanvasService.getWhiteboardCanvasSerialization(
      this.canvas
    );
  }

  get colorMenuShown(): boolean {
    return this.controlFormService.colorMenuShown;
  }

  get fontMenuShown(): boolean {
    return this.controlFormService.fontMenuShown;
  }

  get propertiesMenuShown(): boolean {
    return this.controlFormService.propertiesMenuShown;
  }

  get controls(): typeof Controls {
    return Controls;
  }

  get colorControls(): typeof ColorControls {
    return ColorControls;
  }

  get colors(): ColorDefinition[] {
    return colors;
  }

  get noColor(): ColorDefinition {
    return noColor;
  }

  get isDrawingMode(): boolean {
    return !!this.canvas?.isDrawingMode;
  }

  get controlsForm(): FormGroup {
    return this.controlFormService.controlsForm;
  }

  get colorForm(): FormGroup {
    return this.colorFormService.colorForm;
  }

  get textForm(): FormGroup {
    return this.textFormService.textForm;
  }

  get propertiesForm(): FormGroup {
    return this.propertiesFormService.propertiesForm;
  }

  private createNote(point: fabric.Point): fabric.Group {
    return new CanvasNote({
      color: colors[3].value,
      darkerColor: colors[3].darker,
      point,
    });
  }
}
