import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CanvasDefinitionCell } from '../../canvas-meta-model/canvas-definition-cell';

export interface CanvasDefinitionCellFormValue {
  isSpacer: boolean;
  name?: string;
  id?: string;
  rowspan: number;
  colspan: number;
  guidingQuestions: string[];
  examples: string[];
}

@Injectable({
  providedIn: 'root',
})
export class CanvasDefinitionRowFormService {
  constructor(private fb: FormBuilder) {}

  createForm(canvasDefinitionRows?: CanvasDefinitionCell[][]): FormArray {
    let forms: FormArray[] = [];
    if (canvasDefinitionRows != null) {
      forms = canvasDefinitionRows.map((row) =>
        this.fb.array(
          row.map((cell) => this.createCanvasDefinitionCellForm(cell))
        )
      );
    }
    return this.fb.array(forms);
  }

  createCanvasDefinitionCellForm(
    canvasDefinitionCell?: CanvasDefinitionCell
  ): FormGroup {
    const form = this.fb.group({
      isSpacer: [false, Validators.required],
      name: ['', Validators.required],
      id: [''],
      rowspan: [1, [Validators.required, Validators.min(1)]],
      colspan: [1, [Validators.required, Validators.min(1)]],
      guidingQuestions: this.fb.array(
        canvasDefinitionCell?.guidingQuestions.map(() => [
          '',
          Validators.required,
        ]) ?? []
      ),
      examples: this.fb.array(
        canvasDefinitionCell?.examples.map(() => ['', Validators.required]) ??
          []
      ),
    });
    if (canvasDefinitionCell != null) {
      if (canvasDefinitionCell.isSpacer) {
        form.removeControl('name');
        form.removeControl('id');
      }
      form.patchValue(canvasDefinitionCell);
    }
    return form;
  }

  convertCanvasDefinitionCellForm(
    canvasDefinitionCellForm: FormGroup,
    spacer: boolean
  ): void {
    if (spacer) {
      canvasDefinitionCellForm.removeControl('name');
      canvasDefinitionCellForm.removeControl('id');
    } else {
      canvasDefinitionCellForm.setControl(
        'name',
        this.fb.control('', Validators.required)
      );
      canvasDefinitionCellForm.setControl('id', this.fb.control(''));
    }
  }

  getCanvasDefinitionCellForm(
    formValue: CanvasDefinitionCellFormValue
  ): CanvasDefinitionCell {
    if (formValue.isSpacer) {
      return new CanvasDefinitionCell(undefined, {
        isSpacer: formValue.isSpacer,
        rowspan: formValue.rowspan,
        colspan: formValue.colspan,
        guidingQuestions: formValue.guidingQuestions,
        examples: formValue.examples,
      });
    } else {
      return new CanvasDefinitionCell(undefined, {
        isSpacer: formValue.isSpacer,
        name: formValue.name,
        rowspan: formValue.rowspan,
        colspan: formValue.colspan,
        id: formValue.id,
        guidingQuestions: formValue.guidingQuestions,
        examples: formValue.examples,
      });
    }
  }

  get(formValue: CanvasDefinitionCellFormValue[][]): CanvasDefinitionCell[][] {
    return formValue.map((row) =>
      row.map((cell) => this.getCanvasDefinitionCellForm(cell))
    );
  }
}
