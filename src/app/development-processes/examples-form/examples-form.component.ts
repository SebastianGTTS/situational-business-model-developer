import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-examples-form',
  templateUrl: './examples-form.component.html',
  styleUrls: ['./examples-form.component.css']
})
export class ExamplesFormComponent implements OnChanges {

  @Input() examples: string[];

  @Output() submitExamplesForm = new EventEmitter<FormArray>();

  examplesForm: FormGroup = this.fb.group({
    examples: this.fb.array([]),
  });

  constructor(
    private fb: FormBuilder,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.examples) {
      this.loadForm(changes.examples.currentValue);
    }
  }

  submitForm() {
    this.submitExamplesForm.emit(this.formArray);
  }

  private loadForm(examples: string[]) {
    const formGroups = examples.map((example) => this.fb.control(example, Validators.required));
    this.examplesForm.setControl('examples', this.fb.array(formGroups));
  }

  get formArray(): FormArray {
    return this.examplesForm.get('examples') as FormArray;
  }

}
