import { Component, Input, Optional } from '@angular/core';
import {
  MethodElement,
  MethodElementEntry,
} from '../../development-process-registry/method-elements/method-element';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormGroupName,
} from '@angular/forms';
import { MultipleSelection } from '../../development-process-registry/development-method/multiple-selection';
import { GroupDecisionFormService } from '../shared/group-decision-form.service';

@Component({
  selector: 'app-method-element-info',
  templateUrl: './method-element-info.component.html',
  styleUrls: ['./method-element-info.component.css'],
})
export class MethodElementInfoComponent<T extends MethodElement> {
  @Input() methodElementName!: string;

  @Input() element!: MultipleSelection<T>;

  @Input() methodElements: MethodElementEntry[] = [];

  constructor(
    @Optional() private formGroupName: FormGroupName,
    private groupDecisionFormService: GroupDecisionFormService<T>
  ) {}

  add(index?: number): void {
    if (this.formGroup != null) {
      this.groupDecisionFormService.addElement(this.formGroup, index);
    }
  }

  remove(index: number): void {
    if (this.formGroup != null) {
      this.groupDecisionFormService.removeElement(this.formGroup, index);
    }
  }

  get formGroup(): FormGroup | undefined {
    return this.formGroupName ? this.formGroupName.control : undefined;
  }

  get formElement(): FormControl | undefined {
    return !this.element.multiple
      ? (this.formGroup?.get('element') as FormControl)
      : undefined;
  }

  get formArray(): FormArray | undefined {
    return this.element.multiple
      ? (this.formGroup?.get('elements') as FormArray)
      : undefined;
  }
}
