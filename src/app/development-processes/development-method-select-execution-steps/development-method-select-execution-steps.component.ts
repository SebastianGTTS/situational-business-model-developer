import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DevelopmentMethod } from '../../development-process-registry/development-method/development-method';
import { ExecutionStep } from '../../development-process-registry/development-method/execution-step';
import { ExecutionStepsFormService } from '../shared/execution-steps-form.service';

@Component({
  selector: 'app-development-method-select-execution-steps',
  templateUrl: './development-method-select-execution-steps.component.html',
  styleUrls: ['./development-method-select-execution-steps.component.css']
})
export class DevelopmentMethodSelectExecutionStepsComponent implements OnChanges {

  @Input() developmentMethod: DevelopmentMethod;

  @Output() submitExecutionStepsSelectionForm = new EventEmitter<FormArray>();

  executionStepsSelectionForm: FormGroup = this.fb.group({
    steps: this.fb.array([]),
  });

  constructor(
    private executionStepsFormService: ExecutionStepsFormService,
    private fb: FormBuilder,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.developmentMethod) {
      this.loadForm(changes.developmentMethod.currentValue.executionSteps);
    }
  }

  addStep() {
    this.formArray.push(this.executionStepsFormService.createExecutionStepForm());
  }

  removeStep(index: number) {
    this.formArray.removeAt(index);
  }

  loadForm(executionSteps: ExecutionStep[]) {
    this.executionStepsSelectionForm.setControl('steps', this.executionStepsFormService.createForm(executionSteps));
  }

  submitForm() {
    this.submitExecutionStepsSelectionForm.emit(this.formArray);
  }

  get formArray() {
    return this.executionStepsSelectionForm.get('steps') as FormArray;
  }
}
