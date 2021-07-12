import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-description-form',
  templateUrl: './description-form.component.html',
  styleUrls: ['./description-form.component.css']
})
export class DescriptionFormComponent implements OnChanges {

  @Input() description: string;

  @Output() submitDescriptionForm = new EventEmitter<FormGroup>();

  descriptionForm: FormGroup = this.fb.group({
    description: this.fb.control(''),
  });

  constructor(
    private fb: FormBuilder,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.description) {
      this.loadForm(changes.description.currentValue);
    }
  }

  submitForm() {
    this.submitDescriptionForm.emit(this.descriptionForm);
  }

  private loadForm(description: string) {
    if (description) {
      this.descriptionForm.setValue({description});
    }
  }

}
