import { Component, OnDestroy, OnInit } from '@angular/core';
import { CanvasDefinition } from '../../../canvas-meta-model/canvas-definition';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CanvasDefinitionService } from '../../../canvas-meta-model/canvas-definition.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CanvasDefinitionRowFormService } from '../../form-services/canvas-definition-row-form.service';
import { CanvasDefinitionCell } from '../../../canvas-meta-model/canvas-definition-cell';

@Component({
  selector: 'app-canvas-definition',
  templateUrl: './canvas-definition.component.html',
  styleUrls: ['./canvas-definition.component.css']
})
export class CanvasDefinitionComponent implements OnInit, OnDestroy {

  canvasDefinition: CanvasDefinition;

  rowForm: FormGroup = this.fb.group({
    rows: this.fb.array([]),
  });
  editCanvasDefinitionForm: FormGroup;

  canvas: CanvasDefinitionCell[][] = [];

  private formSubscription: Subscription;
  private routeSubscription: Subscription;

  constructor(
    private canvasDefinitionRowFormService: CanvasDefinitionRowFormService,
    private canvasDefinitionService: CanvasDefinitionService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.formSubscription = this.rowForm.valueChanges.subscribe(
      () => this.canvas = this.canvasDefinitionRowFormService.get(this.rowsFormArray.value)
    );
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      this.loadCanvasDefinition(paramMap.get('id')).then();
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
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
    this.getRow(row).push(this.canvasDefinitionRowFormService.createCanvasDefinitionCellForm());
  }

  spacerChange(row: number, index: number) {
    const form = this.getRow(row).at(index) as FormGroup;
    this.canvasDefinitionRowFormService.convertCanvasDefinitionCellForm(form, form.value.isSpacer);
  }

  removeBlock(row: number, index: number) {
    this.getRow(row).removeAt(index);
  }

  async submitRowForm() {
    const rows = this.canvasDefinitionRowFormService.get(this.rowsFormArray.value);
    this.canvasDefinitionService.updateRows(this.canvasDefinition, rows);
    await this.canvasDefinitionService.save(this.canvasDefinition);
    await this.loadCanvasDefinition(this.canvasDefinition._id);
  }

  async updateName() {
    this.canvasDefinition.name = this.nameControl.value;
    await this.canvasDefinitionService.save(this.canvasDefinition);
    await this.loadCanvasDefinition(this.canvasDefinition._id);
  }

  private async loadCanvasDefinition(canvasDefinitionId: string) {
    this.canvasDefinition = await this.canvasDefinitionService.get(canvasDefinitionId);
    this.loadRowForm(this.canvasDefinition);
    this.loadEditCanvasDefinitionForm(this.canvasDefinition);
  }

  private loadRowForm(canvasDefinition: CanvasDefinition) {
    this.rowForm.setControl('rows', this.canvasDefinitionRowFormService.createForm(canvasDefinition.rows));
  }

  private loadEditCanvasDefinitionForm(canvasDefinition: CanvasDefinition) {
    this.editCanvasDefinitionForm = this.fb.group({
      name: [canvasDefinition.name, Validators.required],
    });
  }

  getRow(index: number): FormArray {
    return this.rowsFormArray.at(index) as FormArray;
  }

  asFormArray(form: AbstractControl): FormArray {
    return form as FormArray;
  }

  get rowsFormArray(): FormArray {
    return this.rowForm.get('rows') as FormArray;
  }

  get nameControl() {
    return this.editCanvasDefinitionForm.get('name');
  }

}
