import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ExecutionStep } from '../../development-process-registry/development-method/execution-step';
import { MethodInfoStepsFormService } from '../shared/method-info-steps-form.service';
import { Domain } from '../../development-process-registry/knowledge/domain';
import { BmProcess } from '../../development-process-registry/bm-process/bm-process';

@Component({
  selector: 'app-method-info-steps',
  templateUrl: './method-info-steps.component.html',
  styleUrls: ['./method-info-steps.component.css']
})
export class MethodInfoStepsComponent implements OnChanges {

  @Input() bmProcess: BmProcess;
  @Input() contextDomains: Domain[];
  @Input() steps: ExecutionStep[];
  @Input() stepDecisions: any[];

  @Output() submitStepsForm = new EventEmitter<any[]>();
  @Output() forceUpdate = new EventEmitter<{ step: number, stepDecision: any }>();

  form: FormGroup = this.fb.group({
    steps: this.fb.array([]),
  });

  constructor(
    private fb: FormBuilder,
    private methodInfoStepsFormService: MethodInfoStepsFormService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.steps || changes.stepDecisions) {
      this.form.setControl('steps', this.methodInfoStepsFormService.createForm(this.steps, this.stepDecisions));
    }
  }

  submitForm() {
    this.submitStepsForm.emit(this.methodInfoStepsFormService.getStepDecisions(this.formArray.value));
  }

  get formArray() {
    return this.form.get('steps') as FormArray;
  }

}
