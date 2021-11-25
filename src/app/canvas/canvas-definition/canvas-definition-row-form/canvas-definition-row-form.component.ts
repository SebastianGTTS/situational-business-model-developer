import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { CanvasDefinitionRowFormService } from '../../form-services/canvas-definition-row-form.service';
import { equalsListOfLists } from '../../../shared/utils';
import { CanvasDefinitionCell } from '../../../canvas-meta-model/canvas-definition-cell';

@Component({
  selector: 'app-canvas-definition-row-form',
  templateUrl: './canvas-definition-row-form.component.html',
  styleUrls: ['./canvas-definition-row-form.component.css'],
})
export class CanvasDefinitionRowFormComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() canvasDefinitionRows: CanvasDefinitionCell[][];

  @Output() submitForm = new EventEmitter<FormArray>();

  form: FormGroup = this.fb.group({
    rows: this.fb.array([]),
  });
  changed = false;

  private changeSubscription: Subscription;

  constructor(
    private canvasDefinitionRowFormService: CanvasDefinitionRowFormService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.changeSubscription = this.form.valueChanges
      .pipe(
        debounceTime(300),
        tap(
          (value) =>
            (this.changed = !this.equalCanvasDefinitionRows(
              this.canvasDefinitionRows,
              this.canvasDefinitionRowFormService.get(value.rows)
            ))
        )
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.canvasDefinitionRows) {
      const newCanvasDefinitionRows = changes.canvasDefinitionRows.currentValue;
      const oldCanvasDefinitionRows =
        changes.canvasDefinitionRows.previousValue;
      if (
        !this.equalCanvasDefinitionRows(
          oldCanvasDefinitionRows,
          newCanvasDefinitionRows
        )
      ) {
        this.loadForm(newCanvasDefinitionRows);
      }
    }
  }

  ngOnDestroy() {
    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
    }
  }

  emitSubmitForm() {
    this.submitForm.emit(this.rowsFormArray);
  }

  addRow(index: number = null) {
    if (index == null) {
      this.rowsFormArray.push(this.fb.array([]));
    } else {
      this.rowsFormArray.insert(index, this.fb.array([]));
    }
  }

  removeRow(index: number) {
    this.rowsFormArray.removeAt(index);
  }

  addBlock(row: number) {
    this.getRow(row).push(
      this.canvasDefinitionRowFormService.createCanvasDefinitionCellForm()
    );
  }

  spacerChange(row: number, index: number) {
    const form = this.getRow(row).at(index) as FormGroup;
    this.canvasDefinitionRowFormService.convertCanvasDefinitionCellForm(
      form,
      form.value.isSpacer
    );
  }

  removeBlock(row: number, index: number) {
    this.getRow(row).removeAt(index);
  }

  getRow(index: number): FormArray {
    return this.rowsFormArray.at(index) as FormArray;
  }

  asFormArray(form: AbstractControl): FormArray {
    return form as FormArray;
  }

  private loadForm(canvasDefinitionRows: CanvasDefinitionCell[][]) {
    this.form.setControl(
      'rows',
      this.canvasDefinitionRowFormService.createForm(canvasDefinitionRows)
    );
  }

  private equalCanvasDefinitionRows(
    canvasDefinitionRowsA: CanvasDefinitionCell[][],
    canvasDefinitionRowsB: CanvasDefinitionCell[][]
  ) {
    if (canvasDefinitionRowsA == null && canvasDefinitionRowsB == null) {
      return true;
    }
    if (canvasDefinitionRowsA == null || canvasDefinitionRowsB == null) {
      return false;
    }
    return equalsListOfLists(canvasDefinitionRowsA, canvasDefinitionRowsB);
  }

  get nameControl() {
    return this.form.get('name');
  }

  get rowsFormArray(): FormArray {
    return this.form.get('rows') as FormArray;
  }
}
