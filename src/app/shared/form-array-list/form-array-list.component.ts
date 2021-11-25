import { Component, Input } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-form-array-list',
  templateUrl: './form-array-list.component.html',
  styleUrls: ['./form-array-list.component.css'],
})
export class FormArrayListComponent {
  @Input() elementName: string;
  @Input() formArray: FormArray;
  @Input() validators: ((control: AbstractControl) => ValidationErrors)[] = [
    Validators.required,
  ];

  @Input() ordered = false;

  constructor(private fb: FormBuilder) {}

  add(): void {
    this.formArray.push(this.fb.control('', this.validators));
  }

  up(position: number): void {
    this.changePosition(position, -1);
  }

  down(position: number): void {
    this.changePosition(position, 1);
  }

  changePosition(position: number, delta: number): void {
    const control = this.formArray.controls[position];
    const newPosition = position + delta;
    this.formArray.removeAt(position);
    this.formArray.insert(newPosition, control);
  }

  remove(index: number): void {
    this.formArray.removeAt(index);
  }

  asFormControl(control: AbstractControl): FormControl {
    return control as FormControl;
  }
}
