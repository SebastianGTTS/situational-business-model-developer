import { Injectable, OnDestroy } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { fabric } from 'fabric';
import { ColorDefinition, colors, noColor } from './color-definition';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CanvasNote } from '../../whiteboard-meta-artifact/canvas-note';

export enum ColorControls {
  FILL,
  STROKE,
}

@Injectable()
export class ColorFormService implements OnDestroy {
  private canvas?: fabric.Canvas;

  colorForm: UntypedFormGroup = this.fb.group({
    control: this.fb.control(ColorControls.FILL, Validators.required),
    color: this.fb.control(undefined),
  });

  private colorFormSubscriptions: Subscription[] = [];

  constructor(private fb: UntypedFormBuilder) {}

  init(canvas: fabric.Canvas): void {
    this.canvas = canvas;
    this.colorFormSubscriptions.push(
      this.colorControlControl.valueChanges.subscribe(() =>
        this.updateColorForm()
      )
    );
    this.colorFormSubscriptions.push(
      this.colorControl.valueChanges
        .pipe(filter((value) => value != null))
        .subscribe((value: ColorDefinition) => this.setColor(value))
    );
  }

  ngOnDestroy(): void {
    for (const subscription of this.colorFormSubscriptions) {
      subscription.unsubscribe();
    }
  }

  updateColorForm(): void {
    if (this.canvas != null) {
      if (this.canvas.isDrawingMode) {
        this.colorControl.setValue(
          this.getColorFromValue(this.canvas.freeDrawingBrush.color),
          { emitEvent: false }
        );
        return;
      }
      const objects = this.canvas.getActiveObjects();
      if (objects.length === 0) {
        this.colorControl.setValue(undefined, { emitEvent: false });
        return;
      }
      const colorControlValue = this.colorControlValue;
      let key: 'fill' | 'stroke';
      switch (colorControlValue) {
        case ColorControls.STROKE:
          key = 'stroke';
          break;
        case ColorControls.FILL:
          key = 'fill';
          break;
        default:
          this.colorControl.setValue(undefined, { emitEvent: false });
          return;
      }
      const firstObject = objects[0];
      let colorValue: unknown;
      if (
        firstObject.type === 'textbox' &&
        (firstObject as fabric.IText).isEditing
      ) {
        const text: fabric.IText = firstObject as fabric.IText;
        const selectionStyles = text.getSelectionStyles();
        if (selectionStyles.length === 0) {
          this.colorControl.setValue(undefined, { emitEvent: false });
          return;
        }
        colorValue = selectionStyles[0][key];
        for (const style of selectionStyles) {
          if (colorValue !== style[key]) {
            this.colorControl.setValue(undefined, { emitEvent: false });
            return;
          }
        }
      } else {
        colorValue = objects[0][key];
        for (const object of objects) {
          if (colorValue !== object[key]) {
            this.colorControl.setValue(undefined, { emitEvent: false });
            return;
          }
        }
      }
      this.colorControl.setValue(this.getColorFromValue(colorValue), {
        emitEvent: false,
      });
    } else {
      throw new Error('ColorFormService not initialized');
    }
  }

  private setColor(color: ColorDefinition): void {
    if (this.canvas != null) {
      if (this.canvas.isDrawingMode) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.canvas.freeDrawingBrush.color = color.value!;
        return;
      }
      const objects = this.canvas.getActiveObjects();
      for (const object of objects) {
        if (object.type === 'canvasNote') {
          const canvasNote = object as CanvasNote;
          switch (this.colorControlValue) {
            case ColorControls.FILL:
              canvasNote.setFillColor(color.value, color.darker);
              break;
            case ColorControls.STROKE:
              canvasNote.setStrokeColor(color.value);
              break;
          }
        } else if (object.type === 'textbox') {
          const text: fabric.IText = object as fabric.IText;
          switch (this.colorControlValue) {
            case ColorControls.FILL:
              if (text.isEditing) {
                text.setSelectionStyles({ fill: color.value });
              } else {
                text.set('fill', color.value);
                text.setSelectionStyles(
                  { fill: color.value },
                  0,
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  text.text!.length
                );
              }
              break;
            case ColorControls.STROKE:
              if (text.isEditing) {
                text.setSelectionStyles({ stroke: color.value });
              } else {
                text.set('stroke', color.value);
                text.setSelectionStyles(
                  { stroke: color.value },
                  0,
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  text.text!.length
                );
              }
              break;
          }
        } else {
          switch (this.colorControlValue) {
            case ColorControls.FILL:
              object.set('fill', color.value);
              break;
            case ColorControls.STROKE:
              object.set('stroke', color.value);
              break;
          }
        }
      }
      this.canvas.renderAll();
    }
  }

  /**
   * Get the correct color definition or undefined from any value.
   *
   * @param colorValue the color value to check
   * @return the color definition or undefined if no color definition was found
   */
  private getColorFromValue(colorValue: unknown): ColorDefinition | undefined {
    if (typeof colorValue === 'string') {
      if (colorValue === noColor.value) {
        return noColor;
      }
      return colors.find((color) => color.value === colorValue);
    } else if (colorValue == null) {
      return noColor;
    } else {
      return undefined;
    }
  }

  private get colorControlControl(): UntypedFormControl {
    return this.colorForm.get('control') as UntypedFormControl;
  }

  private get colorControlValue(): ColorControls {
    return this.colorControlControl.value;
  }

  private get colorControl(): UntypedFormControl {
    return this.colorForm.get('color') as UntypedFormControl;
  }
}
