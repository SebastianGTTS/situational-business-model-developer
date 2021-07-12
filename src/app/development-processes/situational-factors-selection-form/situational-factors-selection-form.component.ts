import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SituationalFactor } from '../../development-process-registry/method-elements/situational-factor/situational-factor';
import {
  SituationalFactorDefinition
} from '../../development-process-registry/method-elements/situational-factor/situational-factor-definition';
import { SituationalFactorService } from '../../development-process-registry/method-elements/situational-factor/situational-factor.service';

@Component({
  selector: 'app-situational-factors-selection-form',
  templateUrl: './situational-factors-selection-form.component.html',
  styleUrls: ['./situational-factors-selection-form.component.css']
})
export class SituationalFactorsSelectionFormComponent implements OnInit, OnChanges {

  @Input() situationalFactors: { list: string, element: SituationalFactor }[];

  @Output() submitSituationalFactorsForm = new EventEmitter<FormArray>();

  situationalFactorsForm: FormGroup = this.fb.group({
    situationalFactors: this.fb.array([]),
  });

  methodElements: SituationalFactorDefinition[] = [];
  listNames: string[] = [];

  constructor(
    private fb: FormBuilder,
    private situationalFactorService: SituationalFactorService,
  ) {
  }

  ngOnInit() {
    this.loadFactors();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.situationalFactors) {
      this.loadForm(changes.situationalFactors.currentValue);
    }
  }

  submitForm() {
    this.submitSituationalFactorsForm.emit(this.situationalFactorsForm.get('situationalFactors') as FormArray);
  }

  private loadForm(situationalFactors: { list: string, element: SituationalFactor }[]) {
    const formGroups = situationalFactors.map((factor) => this.fb.group({
      list: [factor.list, Validators.required],
      element: this.fb.group({
        factor: [factor.element.factor, Validators.required],
        value: [factor.element.value, Validators.required],
      }),
    }));
    this.situationalFactorsForm.setControl('situationalFactors', this.fb.array(formGroups));
  }

  private loadFactors() {
    this.situationalFactorService.getAll().then((types) => {
      this.methodElements = types.docs;
      this.listNames = [...new Set(this.methodElements.map((element) => element.list))];
    });
  }

  createFormGroupFactory = () => this.fb.group({
    list: ['', Validators.required],
    element: this.fb.group({
      factor: [null, Validators.required],
      value: [null, Validators.required],
    }),
  })

}
