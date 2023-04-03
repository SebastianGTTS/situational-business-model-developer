import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { fabric } from 'fabric';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UntypedFormGroup } from '@angular/forms';
import { WhiteboardCanvasControls } from './whiteboard-canvas-controls';
import { CanvasNote } from '../../whiteboard-meta-artifact/canvas-note';
import { WhiteboardCanvasService } from '../../whiteboard-meta-artifact/whiteboard-canvas.service';
import { ColorDefinition, colors, noColor } from './color-definition';
import { TextFormService } from './text-form.service';
import { ColorControls, ColorFormService } from './color-form.service';
import { ControlFormService, Controls } from './control-form.service';
import { PropertiesFormService } from './properties-form.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageSelectorModalComponent } from '../image-selector-modal/image-selector-modal.component';
import { WhiteboardCanvasViewBaseComponent } from '../whiteboard-canvas-view/whiteboard-canvas-view-base.component';

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
  extends WhiteboardCanvasViewBaseComponent
  implements WhiteboardCanvasControls, AfterViewInit, OnDestroy
{
  private controlChangeSubscription?: Subscription;

  private adding = false;
  private image?: string;

  constructor(
    private colorFormService: ColorFormService,
    private controlFormService: ControlFormService,
    private modalService: NgbModal,
    private propertiesFormService: PropertiesFormService,
    private textFormService: TextFormService,
    whiteboardCanvasService: WhiteboardCanvasService
  ) {
    super(whiteboardCanvasService);
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.controlChangeSubscription =
      this.controlFormService.controlControl.valueChanges
        .pipe(tap((value) => this.controlChange(value)))
        .subscribe();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.controlChangeSubscription?.unsubscribe();
  }

  protected async initCanvas(): Promise<void> {
    await super.initCanvas(false);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const canvas = this.canvas!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    canvas.freeDrawingBrush.color = colors[0].value!;
    canvas.freeDrawingBrush.width =
      this.propertiesFormService.widthControlValue;
    this.colorFormService.init(canvas);
    this.textFormService.init(canvas);
    this.propertiesFormService.init(canvas);
    canvas.on('selection:created', () => this.updateForms());
    canvas.on('selection:updated', () => this.updateForms());
    canvas.on('selection:cleared', () => this.updateForms());
    canvas.on('text:selection:changed', () => this.updateForms());
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
    if (this.canvas != null) {
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
        case Controls.IMAGE:
          this.canvas.defaultCursor = 'cell';
          this.openSelectImageModal();
          break;
      }
    }
    this.colorFormService.updateColorForm();
    this.propertiesFormService.updatePropertiesForm();
  }

  protected mouseMove(options: fabric.IEvent<MouseEvent>): void {
    if (options.absolutePointer == null) {
      return;
    }
    if (
      this.moving &&
      this.lastMousePosition != null &&
      this.controlFormService.controlValue === Controls.MOVE &&
      this.canvas != null
    ) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const viewport = this.canvas.viewportTransform!;
      viewport[4] += options.absolutePointer.x - this.lastMousePosition.x;
      viewport[5] += options.absolutePointer.y - this.lastMousePosition.y;
      this.canvas.setViewportTransform(viewport);
    }
  }

  protected mouseDown(options: fabric.IEvent<MouseEvent>): void {
    if (
      options.target != null ||
      options.absolutePointer == null ||
      this.canvas == null
    ) {
      return;
    }
    switch (this.controlFormService.controlValue) {
      case Controls.TEXT:
        // eslint-disable-next-line no-case-declarations
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
      case Controls.IMAGE:
        void this.addImage(options.absolutePointer);
        this.controlFormService.controlControl.setValue(Controls.VIEW);
        this.image = undefined;
        break;
    }
  }

  protected mouseUp(options: fabric.IEvent<MouseEvent>): void {
    if (
      this.adding &&
      options.absolutePointer != null &&
      this.lastMousePosition != null &&
      this.canvas != null
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
          // eslint-disable-next-line no-case-declarations
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

  /**
   * Deletes currently selected object
   */
  delete(): void {
    this.canvas?.remove(...this.canvas.getActiveObjects());
    this.canvas?.discardActiveObject();
  }

  save(): string {
    if (this.canvas == null) {
      throw new Error('Canvas is undefined. Can not save canvas.');
    }
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

  get controlsForm(): UntypedFormGroup {
    return this.controlFormService.controlsForm;
  }

  get colorForm(): UntypedFormGroup {
    return this.colorFormService.colorForm;
  }

  get textForm(): UntypedFormGroup {
    return this.textFormService.textForm;
  }

  get propertiesForm(): UntypedFormGroup {
    return this.propertiesFormService.propertiesForm;
  }

  // noinspection JSMethodCanBeStatic
  private createNote(point: fabric.Point): fabric.Group {
    return new CanvasNote({
      color: colors[3].value,
      darkerColor: colors[3].darker,
      point,
    });
  }

  private async addImage(point: fabric.Point): Promise<void> {
    if (this.image == null) {
      throw new Error('Do not call this method without an image');
    }
    this.canvas?.add(await this.createImage(this.image, point));
  }

  private openSelectImageModal(): void {
    const modal = this.modalService.open(ImageSelectorModalComponent);
    modal.closed.subscribe((image: string) => (this.image = image));
    modal.dismissed.subscribe(() =>
      this.controlFormService.controlControl.setValue(Controls.VIEW)
    );
  }

  private async createImage(
    image: string,
    point: fabric.Point
  ): Promise<fabric.Image> {
    const imgElement: HTMLImageElement = document.createElement('img');
    imgElement.src = image;
    await imgElement.decode();
    return new fabric.Image(imgElement, {
      left: point.x,
      top: point.y,
      originX: 'center',
      originY: 'center',
    });
  }
}
