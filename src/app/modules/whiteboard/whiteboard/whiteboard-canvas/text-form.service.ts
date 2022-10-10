import { Injectable, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { fabric } from 'fabric';

type TextFormValue = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
};

@Injectable()
export class TextFormService implements OnDestroy {
  private canvas?: fabric.Canvas;

  textForm: FormGroup = this.fb.group({
    bold: this.fb.control(false, Validators.required),
    italic: this.fb.control(false, Validators.required),
    underline: this.fb.control(false, Validators.required),
    strikethrough: this.fb.control(false, Validators.required),
  });

  private textFormSubscriptions: Subscription[] = [];

  constructor(private fb: FormBuilder) {}

  init(canvas: fabric.Canvas): void {
    this.canvas = canvas;
    this.textFormSubscriptions.push(
      this.boldControl.valueChanges.subscribe((value) => this.setBold(value))
    );
    this.textFormSubscriptions.push(
      this.italicControl.valueChanges.subscribe((value) =>
        this.setItalic(value)
      )
    );
    this.textFormSubscriptions.push(
      this.underlineControl.valueChanges.subscribe((value) =>
        this.setUnderline(value)
      )
    );
    this.textFormSubscriptions.push(
      this.strikethroughControl.valueChanges.subscribe((value) =>
        this.setStrikethrough(value)
      )
    );
  }

  ngOnDestroy(): void {
    for (const subscription of this.textFormSubscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Update the text form after the selection changed
   */
  updateTextForm(): void {
    if (this.canvas != null) {
      const objects = this.canvas
        .getActiveObjects()
        .filter((object) => object.type === 'textbox');
      const values: TextFormValue = {
        bold: true,
        italic: true,
        underline: true,
        strikethrough: true,
      };
      if (objects.length === 0) {
        values.bold = false;
        values.italic = false;
        values.underline = false;
        values.strikethrough = false;
      }
      for (const object of objects) {
        const text: fabric.IText = object as fabric.IText;
        if (text.isEditing) {
          const selectionStyles = text.getSelectionStyles();
          if (selectionStyles.length === 0) {
            values.bold = false;
            values.italic = false;
            values.underline = false;
            values.strikethrough = false;
          }
          for (const style of selectionStyles) {
            if (!('fontWeight' in style) || style['fontWeight'] !== 'bold') {
              values.bold = false;
            }
            if (!('fontStyle' in style) || style['fontStyle'] !== 'italic') {
              values.italic = false;
            }
            if (!('underline' in style) || !style['underline']) {
              values.underline = false;
            }
            if (!('linethrough' in style) || !style['linethrough']) {
              values.strikethrough = false;
            }
          }
        } else {
          if (text.get('fontWeight') !== 'bold') {
            values.bold = false;
          }
          if (text.get('fontStyle') !== 'italic') {
            values.italic = false;
          }
          if (!text.get('underline')) {
            values.underline = false;
          }
          if (!text.get('linethrough')) {
            values.strikethrough = false;
          }
        }
      }
      this.textForm.setValue(values, { emitEvent: false });
    } else {
      throw new Error('TextFormService not initialized');
    }
  }

  private setBold(bold: boolean): void {
    const value = bold ? 'bold' : 'normal';
    this.setTextStyle('fontWeight', value);
  }

  private setItalic(italic: boolean): void {
    const value = italic ? 'italic' : 'normal';
    this.setTextStyle('fontStyle', value);
  }

  private setUnderline(underline: boolean): void {
    this.setTextStyle('underline', underline);
  }

  private setStrikethrough(strikethrough: boolean): void {
    this.setTextStyle('linethrough', strikethrough);
  }

  private setTextStyle(
    key: keyof fabric.IText,
    value: string | boolean | undefined
  ): void {
    if (this.canvas != null) {
      const activeObjects = this.canvas.getActiveObjects();
      for (const activeObject of activeObjects) {
        if (activeObject.type === 'textbox') {
          const text: fabric.IText = activeObject as fabric.IText;
          if (text.isEditing) {
            text.setSelectionStyles({ [key]: value });
          } else {
            text.set(key, value);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            text.setSelectionStyles({ [key]: value }, 0, text.text!.length);
          }
        }
      }
      this.canvas.renderAll();
    }
  }

  private get boldControl(): FormControl {
    return this.textForm.get('bold') as FormControl;
  }

  private get italicControl(): FormControl {
    return this.textForm.get('italic') as FormControl;
  }

  private get underlineControl(): FormControl {
    return this.textForm.get('underline') as FormControl;
  }

  private get strikethroughControl(): FormControl {
    return this.textForm.get('strikethrough') as FormControl;
  }
}
