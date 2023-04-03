import { Injectable, OnDestroy } from '@angular/core';
import { fabric } from 'fabric';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable()
export class PropertiesFormService implements OnDestroy {
  private canvas?: fabric.Canvas;

  propertiesForm: UntypedFormGroup = this.fb.group({
    width: this.fb.control(1, [Validators.required, Validators.min(0)]),
  });

  private propertiesFormSubscriptions: Subscription[] = [];

  constructor(private fb: UntypedFormBuilder) {}

  init(canvas: fabric.Canvas): void {
    this.canvas = canvas;
    this.propertiesFormSubscriptions.push(
      this.widthControl.valueChanges
        .pipe(filter((value) => value != null && value > 0))
        .subscribe((value) => this.setWidth(value))
    );
  }

  ngOnDestroy(): void {
    for (const subscription of this.propertiesFormSubscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Update the properties form after the selection changed
   * or the control changed
   */
  updatePropertiesForm(): void {
    if (this.canvas != null) {
      if (this.canvas.isDrawingMode) {
        this.widthControl.setValue(this.canvas.freeDrawingBrush.width);
        return;
      }
      const objects = this.canvas.getActiveObjects();
      if (objects.length === 0) {
        this.widthControl.setValue(undefined);
        return;
      }
      const firstObject = objects[0];
      let strokeWidth: number | undefined;
      if (
        firstObject.type === 'textbox' &&
        (firstObject as fabric.IText).isEditing
      ) {
        const text: fabric.IText = firstObject as fabric.IText;
        const selectionStyles = text.getSelectionStyles();
        if (selectionStyles.length === 0) {
          this.widthControl.setValue(undefined);
          return;
        }
        strokeWidth = selectionStyles[0]['strokeWidth'];
        for (const style of selectionStyles) {
          if (strokeWidth !== style['strokeWidth']) {
            this.widthControl.setValue(undefined);
            return;
          }
        }
      } else {
        strokeWidth = firstObject.get('strokeWidth');
        for (const object of objects) {
          if (strokeWidth !== object.get('strokeWidth')) {
            this.widthControl.setValue(undefined);
            return;
          }
        }
      }
      this.widthControl.setValue(strokeWidth);
    } else {
      throw new Error('PropertiesFormService not initialized');
    }
  }

  private setWidth(width: number): void {
    if (this.canvas != null) {
      if (this.canvas.isDrawingMode) {
        this.canvas.freeDrawingBrush.width = width;
        return;
      }
      const objects = this.canvas.getActiveObjects();
      for (const object of objects) {
        if (object.type === 'textbox' && (object as fabric.IText).isEditing) {
          const text: fabric.IText = object as fabric.IText;
          text.setSelectionStyles({ strokeWidth: width });
        } else {
          object.set('strokeWidth', width);
        }
      }
      this.canvas.renderAll();
    }
  }

  private get widthControl(): UntypedFormControl {
    return this.propertiesForm.get('width') as UntypedFormControl;
  }

  get widthControlValue(): number {
    return this.widthControl.value;
  }
}
