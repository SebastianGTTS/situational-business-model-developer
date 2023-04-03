import { Component, Input, TemplateRef } from '@angular/core';
import { MethodElementEntry } from '../../../development-process-registry/method-elements/method-element';
import {
  UntypedFormArray,
  FormArrayName,
  UntypedFormGroup,
} from '@angular/forms';

export interface TemplateContext {
  formGroup: UntypedFormGroup;
  index: number;
  listNames: string[];
  methodElements: MethodElementEntry[];
  methodElementName: string;
  remove: (index: number) => void;
}

@Component({
  selector: 'app-method-elements-selection-form',
  templateUrl: './method-elements-selection-form.component.html',
  styleUrls: ['./method-elements-selection-form.component.css'],
})
export class MethodElementsSelectionFormComponent {
  @Input() idPrefix?: string;
  @Input() methodElementName = 'Element';
  @Input() multipleAllowed = false;

  @Input() methodElements: MethodElementEntry[] = [];
  @Input() listNames: string[] = [];

  @Input() methodElementFormTemplate!: TemplateRef<unknown>;
  @Input() createFormGroupFactory!: () => UntypedFormGroup;

  constructor(private formArrayName: FormArrayName) {}

  add(): void {
    this.formArray.push(this.createFormGroupFactory());
  }

  remove(index: number): void {
    this.formArray.removeAt(index);
  }

  get formArray(): UntypedFormArray {
    return this.formArrayName.control;
  }

  getTemplateContext(
    formGroup: UntypedFormGroup,
    index: number
  ): TemplateContext {
    return {
      formGroup,
      index,
      listNames: this.listNames,
      methodElements: this.methodElements,
      methodElementName: this.methodElementName,
      remove: this.remove.bind(this),
    };
  }
}
