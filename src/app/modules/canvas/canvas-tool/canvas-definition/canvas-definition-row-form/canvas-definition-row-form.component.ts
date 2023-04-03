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
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { CanvasDefinitionRowFormService } from '../../form-services/canvas-definition-row-form.service';
import { equalsListOfLists } from '../../../../../shared/utils';
import { CanvasDefinitionCell } from '../../../canvas-meta-artifact/canvas-definition-cell';
import { UPDATABLE, Updatable } from '../../../../../shared/updatable';

@Component({
  selector: 'app-canvas-definition-row-form',
  templateUrl: './canvas-definition-row-form.component.html',
  styleUrls: ['./canvas-definition-row-form.component.css'],
  providers: [
    { provide: UPDATABLE, useExisting: CanvasDefinitionRowFormComponent },
  ],
})
export class CanvasDefinitionRowFormComponent
  implements OnInit, OnChanges, OnDestroy, Updatable
{
  @Input() canvasDefinitionRows!: CanvasDefinitionCell[][];

  @Output() submitForm = new EventEmitter<UntypedFormArray>();

  form: UntypedFormGroup = this.fb.group({
    rows: this.fb.array([]),
  });
  changed = false;

  private changeSubscription?: Subscription;

  constructor(
    private canvasDefinitionRowFormService: CanvasDefinitionRowFormService,
    private fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
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

  ngOnChanges(changes: SimpleChanges): void {
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

  ngOnDestroy(): void {
    if (this.changeSubscription != null) {
      this.changeSubscription.unsubscribe();
    }
  }

  emitSubmitForm(): void {
    this.submitForm.emit(this.rowsFormArray);
  }

  update(): void {
    if (this.changed && this.form.valid) {
      this.emitSubmitForm();
    }
  }

  addRow(index?: number): void {
    if (index == null) {
      this.rowsFormArray.push(this.fb.array([]));
    } else {
      this.rowsFormArray.insert(index, this.fb.array([]));
    }
  }

  removeRow(index: number): void {
    this.rowsFormArray.removeAt(index);
  }

  addBlock(row: number): void {
    this.getRow(row).push(
      this.canvasDefinitionRowFormService.createCanvasDefinitionCellForm()
    );
  }

  spacerChange(row: number, index: number): void {
    const form = this.getBlock(row, index);
    this.canvasDefinitionRowFormService.convertCanvasDefinitionCellForm(
      form,
      form.value.isSpacer
    );
  }

  removeBlock(row: number, index: number): void {
    this.getRow(row).removeAt(index);
  }

  addGuidingQuestion(row: number, block: number): void {
    const blockForm = this.getBlock(row, block);
    (blockForm.get('guidingQuestions') as UntypedFormArray).push(
      this.fb.control('', Validators.required)
    );
  }

  removeGuidingQuestion(row: number, block: number, index: number): void {
    const questionsForm = this.getBlock(row, block).get(
      'guidingQuestions'
    ) as UntypedFormArray;
    questionsForm.removeAt(index);
  }

  addExample(row: number, block: number): void {
    const blockForm = this.getBlock(row, block);
    (blockForm.get('examples') as UntypedFormArray).push(
      this.fb.control('', Validators.required)
    );
  }

  removeExample(row: number, block: number, index: number): void {
    const example = this.getBlock(row, block).get(
      'examples'
    ) as UntypedFormArray;
    example.removeAt(index);
  }

  getRow(index: number): UntypedFormArray {
    return this.rowsFormArray.at(index) as UntypedFormArray;
  }

  getBlock(row: number, index: number): UntypedFormGroup {
    return this.getRow(row).at(index) as UntypedFormGroup;
  }

  asFormArray(form: AbstractControl): UntypedFormArray {
    return form as UntypedFormArray;
  }

  private loadForm(canvasDefinitionRows: CanvasDefinitionCell[][]): void {
    this.form.setControl(
      'rows',
      this.canvasDefinitionRowFormService.createForm(canvasDefinitionRows)
    );
  }

  // noinspection JSMethodCanBeStatic
  private equalCanvasDefinitionRows(
    canvasDefinitionRowsA: CanvasDefinitionCell[][],
    canvasDefinitionRowsB: CanvasDefinitionCell[][]
  ): boolean {
    if (canvasDefinitionRowsA == null && canvasDefinitionRowsB == null) {
      return true;
    }
    if (canvasDefinitionRowsA == null || canvasDefinitionRowsB == null) {
      return false;
    }
    return equalsListOfLists(canvasDefinitionRowsA, canvasDefinitionRowsB);
  }

  get nameControl(): UntypedFormControl {
    return this.form.get('name') as UntypedFormControl;
  }

  get rowsFormArray(): UntypedFormArray {
    return this.form.get('rows') as UntypedFormArray;
  }
}
